package com.smu8.ticket.concert.admin.http.request;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CreateConcertScheduleRequest(
        LocalDateTime date,
        LocalDateTime reservationEndAt
) {
}
