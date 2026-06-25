package com.smu8.ticket.concert.dto.query;

import lombok.Builder;

@Builder
public record ConcertSeatQuery(
        Long concertId,
        Long performanceScheduleId
) {
}
