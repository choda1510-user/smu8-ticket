package com.smu8.ticket.concert.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ConcertDetailResult(
        Long id,
        String performanceCode,
        String title,
        String performanceStatus,
        String description,
        VenueDetailResult venue,
        String runningTime,
        String cardPosterUrl,
        String screenPosterUrl,
        String descriptionPosterUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<SeatGradeDetailResult> seatGrades,
        List<PerformanceScheduleDetailResult> performanceSchedules,
        LocalDateTime startAt,
        Long venueId,
        String venueName
) {
    public static ConcertDetailResult from(Concert concert) {
        return ConcertDetailResult.builder()
                .id(concert.getId())
                .title(concert.getTitle())
                .performanceStatus(concert.getPerformanceStatus())
                .description(concert.getDescription())
                .venue(VenueDetailResult.from(concert.getVenue()))
                .runningTime(concert.getRunningTime())
                .cardPosterUrl(concert.getCardPosterUrl())
                .screenPosterUrl(concert.getScreenPosterUrl())
                .descriptionPosterUrl(concert.getDescriptionPosterUrl())
                .createdAt(concert.getCreatedAt())
                .updatedAt(concert.getUpdatedAt())
                .seatGrades(concert.getSeatGrades().stream()
                        .map(SeatGradeDetailResult::from)
                        .toList())
                .performanceSchedules(concert.getPerformanceSchedules().stream()
                        .map(PerformanceScheduleDetailResult::from)
                        .toList())
                .venueId(concert.getVenue().getId())
                .venueName(concert.getVenue().getName())
                .build();
    }
}
