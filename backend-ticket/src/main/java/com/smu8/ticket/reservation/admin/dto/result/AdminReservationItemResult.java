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
        return null;
    }
}
