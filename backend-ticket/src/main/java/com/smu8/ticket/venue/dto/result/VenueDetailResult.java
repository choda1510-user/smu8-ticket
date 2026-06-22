package com.smu8.ticket.venue.dto.result;

import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record VenueDetailResult(
        String id,
        String name,
        String address,
        Integer capacity,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static VenueDetailResult from(Venue venue) {
        return VenueDetailResult.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .capacity(venue.getCapacity())
                .description(venue.getDescription())
                .createdAt(venue.getCreatedAt())
                .updatedAt(venue.getUpdatedAt())
                .build();
    }
}
