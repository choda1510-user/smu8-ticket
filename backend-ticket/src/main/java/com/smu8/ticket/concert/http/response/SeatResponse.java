package com.smu8.ticket.concert.http.response;

public record SeatResponse(
        Long id,
        Long seatGradeId,
        Integer row,
        Integer col
) {
}
