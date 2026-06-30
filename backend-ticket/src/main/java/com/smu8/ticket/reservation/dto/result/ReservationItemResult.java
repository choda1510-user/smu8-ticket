package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.dto.result.PerformanceScheduleDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.file.service.StorageService;
import com.smu8.ticket.reservation.entity.Reservation;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReservationItemResult(
        Long reservationId,
        PerformanceScheduleDetailResult reservedSchedule,
        String reservationNo,
        String accountId,
        String reservationStatus,
        Integer totalQuantity,
        Integer totalAmount,
        LocalDateTime reservedAt,
        String concertTitle,
        String cardPosterUrl,
        List<PerformanceScheduleDetailResult> concertSchedules,
        Long venueId,
        String venueName
) {
    public static ReservationItemResult from(Reservation reservation, StorageService storageService) {
        PerformanceSchedule schedule = reservation.getPerformanceSchedule();
        Concert concert = schedule.getConcert();

        return ReservationItemResult.builder()
                .reservationId(reservation.getReservationId())
                .reservedSchedule(PerformanceScheduleDetailResult.from(reservation.getPerformanceSchedule()))
                .reservationNo(reservation.getReservationNo())
                .accountId(reservation.getAccount().getId())
                .reservationStatus(reservation.getReservationStatus())
                .totalQuantity(reservation.getTotalQuantity())
                .totalAmount(reservation.getTotalAmount())
                .reservedAt(reservation.getCreatedAt())
                .concertTitle(concert.getTitle())
                .cardPosterUrl(storageService.getUrl(concert.getCardPosterId()))
                .concertSchedules(concert.getPerformanceSchedules().stream()
                        .map(PerformanceScheduleDetailResult::from)
                        .toList())
                .venueId(concert.getVenue().getId())
                .venueName(concert.getVenue().getName())
                .build();
    }
}
