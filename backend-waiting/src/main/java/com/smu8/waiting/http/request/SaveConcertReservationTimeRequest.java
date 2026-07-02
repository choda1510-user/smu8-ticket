package com.smu8.waiting.http.request;

import com.smu8.waiting.dto.command.SaveConcertReservationTimeCommand;

import java.time.LocalDateTime;

public record SaveConcertReservationTimeRequest(
        LocalDateTime reservationStartDate,
        LocalDateTime reservationLastEndDate
) {
    public SaveConcertReservationTimeCommand toCommand(String concertId) {
        return new SaveConcertReservationTimeCommand(
                concertId,
                reservationStartDate,
                reservationLastEndDate
        );
    }
}
