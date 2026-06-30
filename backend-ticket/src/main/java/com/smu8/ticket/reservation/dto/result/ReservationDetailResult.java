package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.dto.result.PerformanceScheduleDetailResult;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReservationDetailResult (
        Long reservationId,
        String reservationNo,
        AccountDetailResult account,
        PerformanceScheduleDetailResult performanceSchedule,
        ConcertDetailResult concert,
        VenueDetailResult venue,
        String reservationStatus,
        Integer totalQuantity,
        Integer totalAmount,
        List<ReservationSeatDetailResult> seats,
        LocalDateTime createdAt
){

    public static ReservationDetailResult from(Reservation reservation, List<ReservationSeatDetailResult> reservationSeats){
        return ReservationDetailResult.builder()
                .reservationId(reservation.getReservationId())
                .reservationNo(reservation.getReservationNo())
                .account(AccountDetailResult.from(reservation.getAccount()))
                .performanceSchedule(PerformanceScheduleDetailResult.from(reservation.getPerformanceSchedule()))
                .concert(ConcertDetailResult.from(reservation.getPerformanceSchedule().getConcert()))
                .venue(VenueDetailResult.from(reservation.getPerformanceSchedule().getConcert().getVenue()))
                .reservationStatus(reservation.getReservationStatus())
                .totalQuantity(reservation.getTotalQuantity())
                .totalAmount(reservation.getTotalAmount())
                .seats(reservationSeats)
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
