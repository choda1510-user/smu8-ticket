package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.dto.result.SeatDetailResult;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.reservation.http.response.SeatStatus;
import lombok.Builder;

@Builder
public record ConcertSeatStatusResult(
        SeatDetailResult seat,
        SeatStatus status
) {
    public static ConcertSeatStatusResult from(Seat seat, SeatStatus status) {
        return ConcertSeatStatusResult.builder()
                .seat(SeatDetailResult.from(seat))
                .status(status)
                .build();
    }
}
