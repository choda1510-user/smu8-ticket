package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.reservation.entity.CancelReservation;
import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CancelReservationDetailResult(
        Long id,
        Reservation reservation,
        String cancelReason,
        Integer cancelAmount,
        String cancelStatus,
        LocalDateTime createdAt
){
    public static CancelReservationDetailResult from(CancelReservation cancelReservation){
        return CancelReservationDetailResult.builder()
                .id(cancelReservation.getId())
                .reservation(cancelReservation.getReservation())
                .cancelReason(cancelReservation.getCancelReason())
                .cancelAmount(cancelReservation.getCancelAmount())
                .cancelStatus(cancelReservation.getCancelStatus())
                .createdAt(cancelReservation.getCreatedAt())
                .build();
    }
}
