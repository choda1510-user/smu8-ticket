package com.smu8.waiting.http.response;

import com.smu8.waiting.dto.result.ConcertReservationTimeResult;

import java.time.LocalDateTime;

public record ConcertReservationTimeResponse(
        String concertId,
        LocalDateTime reservationStartDate,
        LocalDateTime reservationLastEndDate
) {
    public static ConcertReservationTimeResponse from(ConcertReservationTimeResult result) {
        return new ConcertReservationTimeResponse(
                result.concertId(),
                result.reservationStartDate(),
                result.reservationLastEndDate()
        );
    }
}
