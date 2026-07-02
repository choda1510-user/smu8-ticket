package com.smu8.waiting.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Component
public class WaitingAdmissionScriptRegistry {
    public static final String ADMIT_WAITING_ACCOUNTS_SCRIPT = """
            local count = tonumber(ARGV[1])
            local activeUntil = tonumber(ARGV[2])
            local now = tonumber(ARGV[3])

            redis.call("ZREMRANGEBYSCORE", KEYS[2], "-inf", now)

            if count <= 0 then
                return {}
            end

            local accounts = redis.call("ZRANGE", KEYS[1], 0, count - 1)
            if #accounts == 0 then
                return {}
            end

            for i, accountId in ipairs(accounts) do
                redis.call("ZREM", KEYS[1], accountId)
                redis.call("ZADD", KEYS[2], activeUntil, accountId)
            end

            return accounts
            """;

    private static final String SCRIPT_SHA_KEY = "waiting:script:admit-waiting-accounts:sha";
    private static final String SCRIPT_LOAD_LOCK_KEY = "waiting:script:admit-waiting-accounts:load-lock";
    private static final Duration SCRIPT_LOAD_LOCK_TTL = Duration.ofSeconds(10);
    private static final int SCRIPT_LOAD_LOCK_WAIT_ATTEMPTS = 120;

    private final RedisTemplate<String, String> redisTemplate;

    private volatile String scriptSha;

    public WaitingAdmissionScriptRegistry(
            @Qualifier("concertWaitingQueueRedisTemplate")
            RedisTemplate<String, String> redisTemplate
    ) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void registerScript() {
        this.scriptSha = getOrRegisterScriptSha();
    }

    public String getScriptSha() {
        if (scriptSha == null || scriptSha.isBlank()) {
            scriptSha = getOrRegisterScriptSha();
        }
        return scriptSha;
    }

    public String reloadScript() {
        this.scriptSha = registerScriptWithLock(true);
        return scriptSha;
    }

    private String getOrRegisterScriptSha() {
        String savedScriptSha = redisTemplate.opsForValue().get(SCRIPT_SHA_KEY);
        if (hasText(savedScriptSha)) {
            return savedScriptSha;
        }

        return registerScriptWithLock(false);
    }

    private String registerScriptWithLock(boolean forceLoad) {
        Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(SCRIPT_LOAD_LOCK_KEY, "1", SCRIPT_LOAD_LOCK_TTL);
        if (Boolean.TRUE.equals(locked)) {
            try {
                if (!forceLoad) {
                    String savedScriptSha = redisTemplate.opsForValue().get(SCRIPT_SHA_KEY);
                    if (hasText(savedScriptSha)) {
                        return savedScriptSha;
                    }
                }
                return loadAndSaveScriptSha();
            } finally {
                redisTemplate.delete(SCRIPT_LOAD_LOCK_KEY);
            }
        }

        String savedScriptSha = waitForRegisteredScriptSha();
        if (hasText(savedScriptSha)) {
            return savedScriptSha;
        }

        return registerScriptWithLock(true);
    }

    private String waitForRegisteredScriptSha() {
        for (int i = 0; i < SCRIPT_LOAD_LOCK_WAIT_ATTEMPTS; i++) {
            boolean locked = Boolean.TRUE.equals(redisTemplate.hasKey(SCRIPT_LOAD_LOCK_KEY));
            String savedScriptSha = redisTemplate.opsForValue().get(SCRIPT_SHA_KEY);
            if (!locked && hasText(savedScriptSha)) {
                return savedScriptSha;
            }
            if (!locked) {
                return null;
            }
            sleep();
        }

        return null;
    }

    private String loadAndSaveScriptSha() {
        String loadedScriptSha = loadScript();
        redisTemplate.opsForValue().set(SCRIPT_SHA_KEY, loadedScriptSha);
        return loadedScriptSha;
    }

    private String loadScript() {
        return redisTemplate.execute((RedisCallback<String>) connection ->
                connection.scriptingCommands().scriptLoad(
                        ADMIT_WAITING_ACCOUNTS_SCRIPT.getBytes(StandardCharsets.UTF_8)));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void sleep() {
        try {
            Thread.sleep(100);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while waiting for Lua script registration.", exception);
        }
    }
}
