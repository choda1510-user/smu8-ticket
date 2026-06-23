package com.smu8.ticket.concert.admin.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record UpdateConcertRequest(
        @Schema(description = "수정할 공연 제목", example = "SM 콘서트 2026 앙코르")
        String title,
        @Schema(description = "수정할 공연 설명", example = "앙코르 공연 일정이 추가된 콘서트입니다.")
        String description,
        @Schema(description = "수정할 공연 시작일시", example = "2026-07-02T19:00:00")
        LocalDateTime startAt,
        @Schema(description = "수정할 공연 종료일시", example = "2026-07-02T21:30:00")
        LocalDateTime endAt,
        @Schema(description = "수정할 공연장 고유 ID", example = "1")
        Long venueId
) {
}
