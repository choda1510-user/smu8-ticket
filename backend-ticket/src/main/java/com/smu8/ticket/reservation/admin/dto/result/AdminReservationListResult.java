package com.smu8.ticket.reservation.admin.dto.result;

import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationListResult(
        Long id,
        String accountId,
        String accountName,
        Long concertId,
        String concertTitle,
        String reservationStatus,
        int seatCount,
        BigDecimal totalPrice,
        LocalDateTime createdAt
) {
    public static AdminReservationListResult from(Reservation reservation) {
        return AdminReservationListResult.builder()
                .id(reservation.getReservationId())
                .accountId(reservation.getMemberId())
                .concertId(reservation.getRoundId())
                .reservationStatus(reservation.getReservationStatus())
                .seatCount(reservation.getTotalQuantity())
                .totalPrice(BigDecimal.valueOf(reservation.getTotalAmount()))
                .createdAt(reservation.getReservedAt())
                .build();
    }
}
