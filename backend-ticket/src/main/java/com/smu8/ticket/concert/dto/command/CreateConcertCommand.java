package com.smu8.ticket.concert.dto.command;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.http.request.CreateConcertRequest;
import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CreateConcertCommand(
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String venueId
) {
    public static CreateConcertCommand from(CreateConcertRequest request) {
        return CreateConcertCommand.builder()
                .title(request.title())
                .description(request.description())
                .startAt(request.startAt())
                .endAt(request.endAt())
                .venueId(request.venueId())
                .build();
    }

    public Concert byId(String id, Venue venue) {
        return Concert.builder()
                .id(id)
                .title(title)
                .description(description)
                .startAt(startAt)
                .endAt(endAt)
                .venue(venue)
                .build();
    }
}
