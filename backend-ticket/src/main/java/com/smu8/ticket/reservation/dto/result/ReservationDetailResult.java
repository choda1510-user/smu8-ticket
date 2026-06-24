package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReservationDetailResult (
        Long reservationId,
        String reservationNo,
        Account account,
        PerformanceSchedule performanceSchedule,
        String reservationStatus,
        Integer totalQuantity,
        Integer totalAmount,
        LocalDateTime createdAt
){
    public static ReservationDetailResult from(Reservation reservation){
        return ReservationDetailResult.builder()
                .reservationId(reservation.getReservationId())
                .reservationNo(reservation.getReservationNo())
                .account(reservation.getAccount())
                .performanceSchedule(reservation.getPerformanceSchedule())
                .reservationStatus(reservation.getReservationStatus())
                .totalQuantity(reservation.getTotalQuantity())
                .totalAmount(reservation.getTotalAmount())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
