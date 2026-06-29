package com.smu8.ticket.reservation.admin.http.response;

import com.smu8.ticket.reservation.admin.dto.result.AdminReservationItemResult;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationItemResponse(
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
    public static AdminReservationItemResponse from(AdminReservationItemResult result) {
        return AdminReservationItemResponse.builder()
                .id(result.id())
                .accountId(result.accountId())
                .accountName(result.accountName())
                .concertId(result.concertId())
                .concertTitle(result.concertTitle())
                .reservationStatus(result.reservationStatus())
                .seatCount(result.seatCount())
                .totalPrice(result.totalPrice())
                .createdAt(result.createdAt())
                .build();
    }
}
