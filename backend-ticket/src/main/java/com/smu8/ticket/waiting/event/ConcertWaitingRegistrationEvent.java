package com.smu8.ticket.waiting.event;

import java.time.LocalDateTime;

public record ConcertWaitingRegistrationEvent(
        String concertId,
        LocalDateTime reservationStartDate,
        LocalDateTime reservationLastEndDate
) {
}
