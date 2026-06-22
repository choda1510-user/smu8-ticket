package com.smu8.ticket.venue.http.response;

import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record VenueDetailResponse(
        String id,
        String name,
        String address,
        Integer capacity,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static VenueDetailResponse from(VenueDetailResult result) {
        return VenueDetailResponse.builder()
                .id(result.id())
                .name(result.name())
                .address(result.address())
                .capacity(result.capacity())
                .description(result.description())
                .createdAt(result.createdAt())
                .updatedAt(result.updatedAt())
                .build();
    }
}
