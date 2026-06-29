package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.dto.result.SeatDetailResult;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import lombok.Builder;

@Builder
public record ReservationSeatDetailResult (
        Long id,
        SeatDetailResult seat
){
    public static ReservationSeatDetailResult from(ReservationSeat reservationSeat){
        return ReservationSeatDetailResult.builder()
                .id(reservationSeat.getId())
                .seat(SeatDetailResult.from(reservationSeat.getSeat()))
                .build();
    }
}
