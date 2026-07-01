package com.smu8.ticket.concert.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.file.service.StorageService;
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
        String notice,
        List<PerformanceScheduleDetailResult> schedules,
        List<SeatGradeDetailResult> seatGrades,
        List<SeatDetailResult> seats,
        Long reservedSeatCount,

        LocalDateTime startAt,
        LocalDateTime endAt,
        Long venueId,
        String venueName
) {
    public static ConcertDetailResult from(Concert concert, StorageService storageService) {
        return ConcertDetailResult.builder()
                .id(concert.getId())
                .performanceCode(concert.getPerformanceCode())
                .title(concert.getTitle())
                .performanceStatus(concert.getPerformanceStatus())
                .description(concert.getDescription())
                .venue(VenueDetailResult.from(concert.getVenue()))
                .runningTime(concert.getRunningTime())
                .cardPosterUrl(storageService.getUrl(concert.getCardPosterId()))
                .screenPosterUrl(storageService.getUrl(concert.getScreenPosterId()))
                .descriptionPosterUrl(storageService.getUrl(concert.getDescriptionPosterId()))
                .createdAt(concert.getCreatedAt())
                .updatedAt(concert.getUpdatedAt())
                .venueId(concert.getVenue().getId())
                .venueName(concert.getVenue().getName())
                .notice(concert.getNotice())
                .schedules(concert.getPerformanceSchedules().stream()
                        .map(PerformanceScheduleDetailResult::from)
                        .toList())
                .seatGrades(concert.getSeatGrades().stream()
                        .map(SeatGradeDetailResult::from)
                        .toList())
                .seats(concert.getPerformanceSchedules().stream()
                        .flatMap(schedule -> schedule.getSeats().stream())
                        .map(SeatDetailResult::from)
                        .toList())
                .reservedSeatCount(concert.getPerformanceSchedules().stream()
                        .flatMap(schedule -> schedule.getReservations().stream())
                        .filter(reservation -> !"CANCELED".equalsIgnoreCase(reservation.getReservationStatus()))
                        .mapToLong(reservation -> reservation.getTotalQuantity() == null ? 0 : reservation.getTotalQuantity())
                        .sum())
                .build();
    }
}
