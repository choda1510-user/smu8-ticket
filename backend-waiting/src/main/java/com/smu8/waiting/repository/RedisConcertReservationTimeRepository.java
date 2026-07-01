package com.smu8.waiting.repository;

import com.smu8.waiting.entity.ConcertReservationTime;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RedisConcertReservationTimeRepository implements ConcertReservationTimeRepository {
    private static final String KEY_PREFIX = "waiting:concert:reservation-time:";

    private final RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate;

    public RedisConcertReservationTimeRepository(
            @Qualifier("concertReservationTimeRedisTemplate")
            RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate
    ) {
        this.concertReservationTimeRedisTemplate = concertReservationTimeRedisTemplate;
    }

    @Override
    public Optional<ConcertReservationTime> findByConcertId(String concertId) {
        return Optional.ofNullable(concertReservationTimeRedisTemplate.opsForValue().get(key(concertId)));
    }

    @Override
    public ConcertReservationTime save(ConcertReservationTime concertReservationTime) {
        concertReservationTimeRedisTemplate.opsForValue().set(
                key(concertReservationTime.getConcertId()),
                concertReservationTime
        );
        return concertReservationTime;
    }

    @Override
    public boolean existsByConcertId(String concertId) {
        return Boolean.TRUE.equals(concertReservationTimeRedisTemplate.hasKey(key(concertId)));
    }

    @Override
    public void deleteByConcertId(String concertId) {
        concertReservationTimeRedisTemplate.delete(key(concertId));
    }

    private String key(String concertId) {
        return KEY_PREFIX + concertId;
    }
}
