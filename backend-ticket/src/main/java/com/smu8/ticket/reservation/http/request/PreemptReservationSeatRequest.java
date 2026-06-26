package com.smu8.ticket.reservation.http.request;

import java.util.List;

// 좌석 선점 요청
public record PreemptReservationSeatRequest(
        Long concertId,
        Long scheduleId,
        List<Long> seatIds
) {
}
