package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ConcertItemResponse(
        @Schema(description = "Concert ID")
        Long concertId,
        @Schema(description = "Card poster image URL")
        String cardPosterUrl,
        @Schema(description = "Banner poster image URL")
        String bannerPosterUrl,
        @Schema(description = "Concert title")
        String title,
        @Schema(description = "Concert schedules")
        List<ConcertScheduleResponse> dates,
        @Schema(description = "Reservation start date time")
        LocalDateTime reservationStartAt,
        @Schema(description = "Venue ID")
        Long venueId,
        @Schema(description = "Venue name")
        String venueName
) {
    public static ConcertItemResponse from(ConcertDetailResult result) {
        return ConcertItemResponse.builder()
                .concertId(result.id())
                .cardPosterUrl(result.cardPosterUrl())
                .bannerPosterUrl(result.screenPosterUrl())
                .title(result.title())
                .dates(result.schedules().stream()
                        .map(ConcertScheduleResponse::from)
                        .toList())
                .reservationStartAt(
                        result.schedules().isEmpty()
                                ? null
                                : result.schedules().get(0).reservationStartAt()
                )
                .venueId(result.venueId())
                .venueName(result.venueName())
                .build();
    }
}
