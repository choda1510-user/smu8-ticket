package com.smu8.ticket.concert.admin.http.request;

import java.time.LocalDateTime;

public record UpdateConcertRequest(
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Long venueId
) {
}
