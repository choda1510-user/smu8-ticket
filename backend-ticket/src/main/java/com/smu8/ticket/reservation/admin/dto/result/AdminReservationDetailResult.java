package com.smu8.ticket.reservation.admin.dto.result;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminReservationDetailResult (
        Long id,
        Long accountId,
        String accountName,
        Long concertId,
        String concertTitle,
        String reservationStatus,
        BigDeciaml totalPrice,
        String cancelReason,
        LocalDateTime createdAt
){
}
