package com.smu8.ticket.concert.http.response;

import lombok.Builder;

@Builder
public record SeatResponse(
        Long id,
        Long seatGradeId,
        Integer row,
        Integer col
) {
}
