package com.smu8.waiting.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.redis.connection.ReturnType;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Component
public class WaitingAdmissionScriptExecutor {
    private static final String QUEUE_KEY_PREFIX = "waiting:concert:queue:";
    private static final String ACTIVE_ACCOUNT_KEY_PREFIX = "waiting:concert:active-account:";
    private static final String ADMISSION_LOCK_KEY_PREFIX = "waiting:concert:admission-lock:";

    private final WaitingAdmissionScriptRegistry scriptRegistry;

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${waiting.admission.lock-ttl-millis:1000}")
    private long admissionLockTtlMillis;

    public WaitingAdmissionScriptExecutor(
            WaitingAdmissionScriptRegistry scriptRegistry,
            @Qualifier("concertWaitingQueueRedisTemplate")
            RedisTemplate<String, String> redisTemplate
    ) {
        this.scriptRegistry = scriptRegistry;
        this.redisTemplate = redisTemplate;
    }

    public long admit(String concertId, long count, Duration activeTtl) {
        if (count <= 0 || activeTtl == null || activeTtl.isZero() || activeTtl.isNegative()) {
            return 0;
        }

        Boolean locked = redisTemplate.opsForValue().setIfAbsent(
                ADMISSION_LOCK_KEY_PREFIX + concertId,
                "1",
                Duration.ofMillis(admissionLockTtlMillis)
        );
        if (!Boolean.TRUE.equals(locked)) {
            return 0;
        }

        return executeScript(concertId, count, activeTtl, scriptRegistry.getScriptSha()).size();
    }

    private List<String> executeScript(String concertId, long count, Duration activeTtl, String scriptSha) {
        try {
            return executeScriptBySha(concertId, count, activeTtl, scriptSha);
        } catch (RuntimeException exception) {
            if (!isNoScriptException(exception)) {
                throw exception;
            }
            return executeScriptBySha(concertId, count, activeTtl, scriptRegistry.reloadScript());
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> executeScriptBySha(String concertId, long count, Duration activeTtl, String scriptSha) {
        long now = System.currentTimeMillis();
        long activeUntil = now + activeTtl.toMillis();

        List<byte[]> result = redisTemplate.execute((RedisCallback<List<byte[]>>) connection ->
                (List<byte[]>) connection.scriptingCommands().evalSha(
                        scriptSha,
                        ReturnType.MULTI,
                        2,
                        bytes(QUEUE_KEY_PREFIX + concertId),
                        bytes(ACTIVE_ACCOUNT_KEY_PREFIX + concertId),
                        bytes(String.valueOf(count)),
                        bytes(String.valueOf(activeUntil)),
                        bytes(String.valueOf(now))
                ));

        if (result == null) {
            return List.of();
        }

        return result.stream()
                .map((accountId) -> new String(accountId, StandardCharsets.UTF_8))
                .toList();
    }

    private byte[] bytes(String value) {
        return value.getBytes(StandardCharsets.UTF_8);
    }

    private boolean isNoScriptException(RuntimeException exception) {
        Throwable current = exception;
        while (current != null) {
            String message = current.getMessage();
            if (message != null && message.contains("NOSCRIPT")) {
                return true;
            }
            current = current.getCause();
        }
        return exception instanceof InvalidDataAccessApiUsageException
                && exception.getMessage() != null
                && exception.getMessage().contains("NOSCRIPT");
    }
}
