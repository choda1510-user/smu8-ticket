package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.ConcertScheduleResponse;
import com.smu8.ticket.reservation.dto.result.ReservationItemResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReservationItemResponse(
        @Schema(description = "예매 고유 Id")
        Long reservationId,
        @Schema(description = "예매한 공연 회차")
        ConcertScheduleResponse reservedSchedule,
        @Schema(description = "예매번호")
        String reservationNo,
        @Schema(description = "예매자 고유 Id")
        String accountId,
        @Schema(description = "예매 상태")
        String reservationStatus,
        @Schema(description = "예매한 좌석 총합 수")
        Integer totalQuantity,
        @Schema(description = "예매 총합 금액")
        Integer totalAmount,
        @Schema(description = "예매 날짜")
        LocalDateTime reservedAt,
        @Schema(description = "공연 제목")
        String concertTitle,
        @Schema(description = "공연 카드 이미지 주소")
        String cardPosterUrl,
        @Schema(description = "예매한 공연 회차 전체 목록")
        List<ConcertScheduleResponse> concertSchedules,
        @Schema(description = "공연장 고유 Id")
        Long venueId,
        @Schema(description = "공연장 이름")
        String venueName
) {
    public static ReservationItemResponse from(ReservationItemResult result) {
        return ReservationItemResponse.builder()
                .reservationId(result.reservationId())
                .reservedSchedule(ConcertScheduleResponse.from(result.reservedSchedule()))
                .reservationNo(result.reservationNo())
                .accountId(result.accountId())
                .reservationStatus(result.reservationStatus())
                .totalQuantity(result.totalQuantity())
                .totalAmount(result.totalAmount())
                .reservedAt(result.reservedAt())
                .concertTitle(result.concertTitle())
                .cardPosterUrl(result.cardPosterUrl())
                .concertSchedules(result.concertSchedules().stream()
                        .map(ConcertScheduleResponse::from)
                        .toList())
                .venueId(result.venueId())
                .venueName(result.venueName())
                .build();
    }
}
