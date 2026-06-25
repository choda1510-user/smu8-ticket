package com.smu8.ticket.concert.admin.http.request;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CreateConcertScheduleRequest(
        LocalDateTime date,
        LocalDateTime reservationEndAt,
        Integer rowMax,
        Integer colMax,
        List<CreateSeatRequest> seats
) {
}
