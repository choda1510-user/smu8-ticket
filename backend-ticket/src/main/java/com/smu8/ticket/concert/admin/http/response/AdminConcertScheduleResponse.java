package com.smu8.ticket.concert.admin.http.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminConcertScheduleResponse(
        @Schema(description = "회차 고유 Id")
        Long id,
        @Schema(description = "공연 고유 Id")
        Long concertId,
        @Schema(description = "공연 날짜")
        LocalDateTime date,
        @Schema(description = "예매 마감일시")
        LocalDateTime reservationEndAt
) {
}
