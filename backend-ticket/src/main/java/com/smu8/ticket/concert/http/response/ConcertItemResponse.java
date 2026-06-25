package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ConcertItemResponse(
        Long concertId,
        String cardPosterUrl,
        String bannerPosterUrl,
        String title,
        List<ConcertScheduleResponse> dates,
        LocalDateTime reservationStartAt,
        Long venueId,
        String venueName
) {
    public static ConcertItemResponse from(ConcertDetailResult result) {
        return null;
    }
}
