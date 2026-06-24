package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import lombok.Builder;

@Builder
public record ReservationSeatDetailResult (
        Long id,
        Reservation reservation,
        Seat seat
){
    public static ReservationSeatDetailResult from(ReservationSeat reservationSeat){
        return ReservationSeatDetailResult.builder()
                .id(reservationSeat.getId())
                .reservation(reservationSeat.getReservation())
                .seat(reservationSeat.getSeat())
                .build();
    }
}
