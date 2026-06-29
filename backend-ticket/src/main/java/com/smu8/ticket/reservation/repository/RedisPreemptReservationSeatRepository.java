package com.smu8.ticket.reservation.repository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
public class RedisPreemptReservationSeatRepository implements PreemptReservationSeatRepository {
    private static final String PREEMPT_SEAT_KEY_PREFIX = "reservation:preempt:seat:";

    private final RedisTemplate<String, String> redisTicketTemplate;
    private final Duration ttl;

    public RedisPreemptReservationSeatRepository(
            @Qualifier("redisTicketTemplate")
            RedisTemplate<String, String> redisTicketTemplate,
            @Value("${reservation.preempt-seat.ttl-seconds:300}")
            long ttlSeconds
    ) {
        this.redisTicketTemplate = redisTicketTemplate;
        this.ttl = Duration.ofSeconds(ttlSeconds);
    }

    @Override
    public void createPreempt(String seatId, String accountId) throws IllegalStateException {
        Boolean created = redisTicketTemplate.opsForValue()
                .setIfAbsent(key(seatId), accountId, ttl);

        if (Boolean.TRUE.equals(created)) {
            return;
        }

        String preemptAccountId = findOwnPreemptAccountId(seatId);
        if (accountId.equals(preemptAccountId)) {
            redisTicketTemplate.expire(key(seatId), ttl);
            return;
        }

        throw new IllegalStateException("Seat is already preempted by another account.");
    }

    @Override
    public void removePreempt(String seatId) {
        redisTicketTemplate.delete(key(seatId));
    }

    @Override
    public boolean existsPreempt(String seatId) {
        return Boolean.TRUE.equals(redisTicketTemplate.hasKey(key(seatId)));
    }

    @Override
    public String findOwnPreemptAccountId(String seatId) {
        return redisTicketTemplate.opsForValue().get(key(seatId));
    }

    private String key(String seatId) {
        return PREEMPT_SEAT_KEY_PREFIX + seatId;
    }
}
