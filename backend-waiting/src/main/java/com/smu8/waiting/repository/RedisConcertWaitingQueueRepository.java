package com.smu8.waiting.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.RedisZSetCommands;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.nio.charset.StandardCharsets;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class RedisConcertWaitingQueueRepository implements ConcertWaitingQueueRepository {
    private static final String KEY_PREFIX = "waiting:concert:queue:";

    private final RedisTemplate<String, String> concertWaitingQueueRedisTemplate;

    public RedisConcertWaitingQueueRepository(
            @Qualifier("concertWaitingQueueRedisTemplate")
            RedisTemplate<String, String> concertWaitingQueueRedisTemplate
    ) {
        this.concertWaitingQueueRedisTemplate = concertWaitingQueueRedisTemplate;
    }

    @Override
    public boolean enqueue(String concertId, String accountId, double score) {
        return Boolean.TRUE.equals(concertWaitingQueueRedisTemplate.execute((RedisCallback<Boolean>) connection ->
                connection.zSetCommands().zAdd(
                        bytes(key(concertId)),
                        score,
                        bytes(accountId),
                        RedisZSetCommands.ZAddArgs.ifNotExists()
                )));
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

    private byte[] bytes(String value) {
        return value.getBytes(StandardCharsets.UTF_8);
    }
}
