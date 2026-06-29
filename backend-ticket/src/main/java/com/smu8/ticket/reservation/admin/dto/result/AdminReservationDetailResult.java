package com.smu8.ticket.reservation.admin.dto.result;

import com.smu8.ticket.reservation.entity.CancelReservation;
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
        LocalDateTime reservedAt,
        LocalDateTime canceledAt
){
   public static AdminReservationDetailResult from(Reservation reservation){
       CancelReservation cancelReservation = reservation.getCancelReservations().stream()
               .reduce((first, second) -> second)
               .orElse(null);

       return from(reservation, cancelReservation);
   }

   public static AdminReservationDetailResult from(Reservation reservation, CancelReservation cancelReservation){
       return AdminReservationDetailResult.builder()
               .id(reservation.getReservationId())
               .accountId(reservation.getAccount().getId())
               .accountName(reservation.getAccount().getNickname())
               .concertId(reservation.getPerformanceSchedule().getConcert().getId())
               .concertTitle(reservation.getPerformanceSchedule().getConcert().getTitle())
               .reservationStatus(reservation.getReservationStatus())
               .totalPrice(BigDecimal.valueOf(reservation.getTotalAmount()))
               .cancelReason(cancelReservation == null ? null : cancelReservation.getCancelReason())
               .reservedAt(reservation.getCreatedAt())
               .canceledAt(cancelReservation == null ? null : cancelReservation.getCreatedAt())
               .build();
   }
}
