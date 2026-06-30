package com.smu8.ticket.reservation.dto.query;

import lombok.Builder;

@Builder
public record ReservationConcertSeatFrameQuery(
        Long concertId,
        Long scheduleId
) {
    public static ReservationConcertSeatFrameQuery of(Long concertId,  Long scheduleId) {
        return new ReservationConcertSeatFrameQuery(concertId, scheduleId);
    }
}
