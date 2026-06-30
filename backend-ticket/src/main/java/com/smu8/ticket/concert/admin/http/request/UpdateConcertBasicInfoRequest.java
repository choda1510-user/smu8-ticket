package com.smu8.ticket.concert.admin.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateConcertBasicInfoRequest(
        @Schema(description = "수정할 공연 제목", example = "SM 콘서트 2026 앙코르")
        String title,
        @Schema(description = "수정할 공연 설명", example = "앙코르 공연 일정이 추가된 콘서트입니다.")
        String description,
        @Schema(description = "수정할 공연 러닝타임(분)", example = "150")
        String runningTime
) {
}