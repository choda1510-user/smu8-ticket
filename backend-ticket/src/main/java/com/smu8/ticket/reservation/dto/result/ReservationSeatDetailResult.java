package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.dto.result.SeatDetailResult;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import com.smu8.ticket.reservation.http.response.SeatStatus;
import lombok.Builder;

@Builder
public record ReservationSeatDetailResult (
        Long id,
        SeatDetailResult seat,
        SeatStatus status
){
    public static ReservationSeatDetailResult from(ReservationSeat reservationSeat, SeatStatus status){
        return ReservationSeatDetailResult.builder()
                .id(reservationSeat.getId())
                .seat(SeatDetailResult.from(reservationSeat.getSeat()))
                .status(status)
                .build();
    }
}
