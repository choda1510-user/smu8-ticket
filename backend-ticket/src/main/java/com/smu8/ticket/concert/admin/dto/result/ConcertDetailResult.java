package com.smu8.ticket.concert.admin.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ConcertDetailResult(
        Long id,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Long venueId,
        String venueName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ConcertDetailResult from(Concert concert) {
        return ConcertDetailResult.builder()
                .id(concert.getId())
                .title(concert.getTitle())
                .description(concert.getDescription())
                .startAt(concert.getStartAt())
                .endAt(concert.getEndAt())
                .venueId(concert.getVenue().getId())
                .venueName(concert.getVenue().getName())
                .createdAt(concert.getCreatedAt())
                .updatedAt(concert.getUpdatedAt())
                .build();
    }
}
