package com.smu8.ticket.concert.http.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

// 공연회차
// PerformanceSchedule
@Builder
public record ConcertScheduleResponse(
        @Schema(description = "공연 회차 고유 ID")
        Long id,
        @Schema(description = "공연 고유 Id")
        Long concertId,
        @Schema(description = "공연 날짜 및 시간")
        LocalDateTime date,
        @Schema(description = "예매 종료일시")
        LocalDateTime reservationEndAt
) {
}
