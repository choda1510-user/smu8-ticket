package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.ConcertScheduleResponse;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReservationDetailResponse(
        Long reservationId,
        ConcertScheduleResponse reservedSchedule,
        String reservationNo,
        String accountId,
        String reservationStatus,
        Integer totalQuantity,
        Integer totalAmount,
        LocalDateTime reservedAt,
        String concertTitle,
        String cardPosterUrl,
        List<ConcertScheduleResponse> concertSchedules,
        Long venueId,
        String venueName,
        List<ReservationSeatResponse> seats
) {
}
