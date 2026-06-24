package com.smu8.ticket.reservation.admin.http.response;

import com.smu8.ticket.reservation.admin.dto.result.AdminReservationDetailResult;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record AdminReservationDetailResponse(
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
) {
    public static AdminReservationDetailResponse from(AdminReservationDetailResult result) {
        return AdminReservationDetailResponse.builder()
                .id(result.id())
                .accountId(result.accountId())
                .accountName(result.accountName())
                .concertId(result.concertId())
                .concertTitle(result.concertTitle())
                .reservationStatus(result.reservationStatus())
                .totalPrice(result.totalPrice())
                .cancelReason(result.cancelReason())
                .reservedAt(result.reservedAt())
                                .build();
    }
}