package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ConcertDetailResponse(
        @Schema(description = "공연 고유 ID", example = "1")
        Long id,
        @Schema(description = "공연 제목", example = "SM 콘서트 2026")
        String title,
        @Schema(description = "공연 설명", example = "대표 아티스트들이 함께하는 라이브 콘서트입니다.")
        String description,
        @Schema(description = "공연 시작일시", example = "2026-07-01T19:00:00")
        LocalDateTime startAt,
        @Schema(description = "공연 종료일시", example = "2026-07-01T21:30:00")
        LocalDateTime endAt,
        @Schema(description = "공연장 고유 ID", example = "1")
        Long venueId,
        @Schema(description = "공연장 이름", example = "서울아트센터")
        String venueName,
        @Schema(description = "생성일시", example = "2026-06-22T10:30:00")
        LocalDateTime createdAt,
        @Schema(description = "수정일시", example = "2026-06-22T10:30:00")
        LocalDateTime updatedAt
) {
    public static ConcertDetailResponse from(ConcertDetailResult result) {
        return ConcertDetailResponse.builder()
                .id(result.id())
                .title(result.title())
                .description(result.description())
                .startAt(result.startAt())
                .endAt(result.endAt())
                .venueId(result.venueId())
                .venueName(result.venueName())
                .createdAt(result.createdAt())
                .updatedAt(result.updatedAt())
                .build();
    }
}
