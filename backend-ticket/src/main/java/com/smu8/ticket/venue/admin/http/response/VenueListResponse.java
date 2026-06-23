package com.smu8.ticket.venue.admin.http.response;

import com.smu8.ticket.venue.admin.dto.result.VenueDetailResult;
import lombok.Builder;

import java.util.List;

@Builder
public record VenueListResponse(
        List<VenueDetailResponse> venues
) {
    public static VenueListResponse from(List<VenueDetailResult> results) {
        return VenueListResponse.builder()
                .venues(results.stream()
                        .map(VenueDetailResponse::from)
                        .toList())
                .build();
    }
}
