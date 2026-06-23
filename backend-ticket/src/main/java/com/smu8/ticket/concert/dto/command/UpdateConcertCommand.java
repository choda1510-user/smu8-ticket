package com.smu8.ticket.concert.dto.command;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.http.request.UpdateConcertRequest;
import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UpdateConcertCommand(
        Long id,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Long venueId
) {
    public static UpdateConcertCommand from(Long id, UpdateConcertRequest request) {
        return UpdateConcertCommand.builder()
                .id(id)
                .title(request.title())
                .description(request.description())
                .startAt(request.startAt())
                .endAt(request.endAt())
                .venueId(request.venueId())
                .build();
    }

    public void update(Concert concert, Venue venue) {
        concert.setTitle(title);
        concert.setDescription(description);
        concert.setStartAt(startAt);
        concert.setEndAt(endAt);
        concert.setVenue(venue);
    }
}
