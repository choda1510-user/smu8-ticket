package com.smu8.ticket.reservation.admin.dto.result;

import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationListResult(
        Long id,
        Long accountId,
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
                .id(reservation.getId())
                .accountId(reservation.getAccount().getId())
                .accountName(reservation.getAccount().getName())
                .concertId(reservation.getConcert().getId())
                .concertTitle(reservation.getConcert().getTitle())
                .reservationStatus(reservation.getStatus().name())
                .seatCount(reservation.getReservationSeats().size())
                .totalPrice(reservation.getTotalPrice())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
