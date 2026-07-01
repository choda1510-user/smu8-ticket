package com.smu8.waiting.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class RedisConcertWaitingQueueRepository implements ConcertWaitingQueueRepository {
    private static final String KEY_PREFIX = "waiting:concert:queue:";
    private static final String POP_WAITING_ACCOUNTS_SCRIPT = """
            local count = tonumber(ARGV[1])
            local accounts = redis.call("ZRANGE", KEYS[1], 0, count - 1)

            if #accounts == 0 then
                return {}
            end

            for i, accountId in ipairs(accounts) do
                redis.call("ZREM", KEYS[1], accountId)
            end

            return accounts
            """;

    private final RedisTemplate<String, String> concertWaitingQueueRedisTemplate;
    private final DefaultRedisScript<List> popWaitingAccountsScript;

    public RedisConcertWaitingQueueRepository(
            @Qualifier("concertWaitingQueueRedisTemplate")
            RedisTemplate<String, String> concertWaitingQueueRedisTemplate
    ) {
        this.concertWaitingQueueRedisTemplate = concertWaitingQueueRedisTemplate;
        this.popWaitingAccountsScript = new DefaultRedisScript<>();
        this.popWaitingAccountsScript.setScriptText(POP_WAITING_ACCOUNTS_SCRIPT);
        this.popWaitingAccountsScript.setResultType(List.class);
    }

    @Override
    public boolean enqueue(String concertId, String accountId, double score) {
        return Boolean.TRUE.equals(concertWaitingQueueRedisTemplate.opsForZSet().add(key(concertId), accountId, score));
    }

    @Override
    public Optional<Long> findRank(String concertId, String accountId) {
        return Optional.ofNullable(concertWaitingQueueRedisTemplate.opsForZSet().rank(key(concertId), accountId));
    }

    @Override
    public boolean contains(String concertId, String accountId) {
        return concertWaitingQueueRedisTemplate.opsForZSet().score(key(concertId), accountId) != null;
    }

    @Override
    public List<String> findWaitingAccounts(String concertId, long start, long end) {
        Set<String> accounts = concertWaitingQueueRedisTemplate.opsForZSet().range(key(concertId), start, end);
        return accounts == null ? List.of() : new ArrayList<>(accounts);
    }

    @Override
    public List<String> popWaitingAccounts(String concertId, long count) {
        if (count <= 0) {
            return List.of();
        }

        List<?> accounts = concertWaitingQueueRedisTemplate.execute(
                popWaitingAccountsScript,
                List.of(key(concertId)),
                String.valueOf(count)
        );

        if (accounts == null) {
            return List.of();
        }

        return accounts.stream()
                .map(String::valueOf)
                .toList();
    }

    @Override
    public void remove(String concertId, String accountId) {
        concertWaitingQueueRedisTemplate.opsForZSet().remove(key(concertId), accountId);
    }

    @Override
    public long count(String concertId) {
        Long count = concertWaitingQueueRedisTemplate.opsForZSet().zCard(key(concertId));
        return count == null ? 0 : count;
    }

    @Override
    public void deleteByConcertId(String concertId) {
        concertWaitingQueueRedisTemplate.delete(key(concertId));
    }

    private String key(String concertId) {
        return KEY_PREFIX + concertId;
    }
}
