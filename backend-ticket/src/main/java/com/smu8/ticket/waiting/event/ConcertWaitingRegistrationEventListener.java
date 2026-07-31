package com.smu8.ticket.waiting.event;

import com.smu8.ticket.waiting.entity.ConcertReservationTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
public class ConcertWaitingRegistrationEventListener {
    private static final String CONCERT_RESERVATION_TIME_KEY_PREFIX = "waiting:concert:reservation-time:";

    private final RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate;

    public ConcertWaitingRegistrationEventListener(
            RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate
    ) {
        this.concertReservationTimeRedisTemplate = concertReservationTimeRedisTemplate;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(ConcertWaitingRegistrationEvent event) {
        try {
            concertReservationTimeRedisTemplate.opsForValue().set(
                    CONCERT_RESERVATION_TIME_KEY_PREFIX + event.concertId(),
                    ConcertReservationTime.builder()
                            .concertId(event.concertId())
                            .reservationStartDate(event.reservationStartDate())
                            .reservationLastEndDate(event.reservationLastEndDate())
                            .build()
            );
        } catch (RuntimeException exception) {
            log.error("Failed to register concert waiting metadata. concertId={}", event.concertId(), exception);
        }
    }
}
