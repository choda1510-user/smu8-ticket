package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ConcertDetailResponse(
        String id,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String venueId,
        String venueName,
        LocalDateTime createdAt,
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
