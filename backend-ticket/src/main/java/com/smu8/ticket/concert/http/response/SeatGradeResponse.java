package com.smu8.ticket.concert.http.response;

import lombok.Builder;

@Builder
public record SeatGradeResponse(
        Long id,
        String gradeName,
        Integer price,
        String color
) {
}
