package com.smu8.ticket.reservation.admin.dto.result;

import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationItemResult(
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
    public static AdminReservationItemResult from(Reservation reservation) {
        return AdminReservationItemResult.builder()
                .id(reservation.getReservationId())
                .accountId(reservation.getAccount().getId())
                .accountName(reservation.getAccount().getNickname())
                .concertId(reservation.getPerformanceSchedule().getConcert().getId())
                .concertTitle(reservation.getPerformanceSchedule().getConcert().getTitle())
                .reservationStatus(reservation.getReservationStatus())
                .seatCount(reservation.getTotalQuantity())
                .totalPrice(BigDecimal.valueOf(reservation.getTotalAmount()))
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
