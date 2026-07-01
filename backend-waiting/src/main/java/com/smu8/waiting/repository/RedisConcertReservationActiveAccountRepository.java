package com.smu8.waiting.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
public class RedisConcertReservationActiveAccountRepository implements ConcertReservationActiveAccountRepository {
    private static final String KEY_PREFIX = "waiting:concert:active-account:";

    private final RedisTemplate<String, String> concertPassedUserRedisTemplate;

    public RedisConcertReservationActiveAccountRepository(
            @Qualifier("concertPassedUserRedisTemplate")
            RedisTemplate<String, String> concertPassedUserRedisTemplate
    ) {
        this.concertPassedUserRedisTemplate = concertPassedUserRedisTemplate;
    }

    @Override
    public void add(String concertId, String accountId, Duration ttl) {
        concertPassedUserRedisTemplate.opsForZSet().add(
                key(concertId),
                accountId,
                System.currentTimeMillis() + ttl.toMillis()
        );
    }

    @Override
    public boolean contains(String concertId, String accountId) {
        removeExpired(concertId);
        return concertPassedUserRedisTemplate.opsForZSet().score(key(concertId), accountId) != null;
    }

    @Override
    public void removeExpired(String concertId) {
        concertPassedUserRedisTemplate.opsForZSet().removeRangeByScore(
                key(concertId),
                Double.NEGATIVE_INFINITY,
                System.currentTimeMillis()
        );
    }

    @Override
    public void remove(String concertId, String accountId) {
        concertPassedUserRedisTemplate.opsForZSet().remove(key(concertId), accountId);
    }

    @Override
    public long count(String concertId) {
        removeExpired(concertId);
        Long count = concertPassedUserRedisTemplate.opsForZSet().zCard(key(concertId));
        return count == null ? 0 : count;
    }

    @Override
    public void deleteByConcertId(String concertId) {
        concertPassedUserRedisTemplate.delete(key(concertId));
    }

    private String key(String concertId) {
        return KEY_PREFIX + concertId;
    }
}
