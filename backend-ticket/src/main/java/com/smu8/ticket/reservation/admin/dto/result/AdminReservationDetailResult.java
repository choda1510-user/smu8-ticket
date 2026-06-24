package com.smu8.ticket.reservation.admin.dto.result;

import com.smu8.ticket.reservation.dto.result.ReservationDetailResult;
import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationDetailResult (
        Long id,
        String accountId,
        String accountName,
        Long concertId,
        String concertTitle,
        String reservationStatus,
        BigDecimal totalPrice,
        String cancelReason,
        LocalDateTime reservedAt
){
   public static AdminReservationDetailResult from(Reservation reservation){
       return AdminReservationDetailResult.builder()
               .id(reservation.getReservationId())
               .accountId(reservation.getMemberId())
               .concertId(reservation.getRoundId())
               .reservationStatus(reservation.getReservationStatus())
               .totalPrice(BigDecimal.valueOf(reservation.getTotalAmount()))
               .cancelReason(null)
               .reservedAt(reservation.getReservedAt())
               .build();


   }
}
