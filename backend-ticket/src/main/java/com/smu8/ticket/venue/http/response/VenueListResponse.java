package com.smu8.ticket.venue.http.response;

import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Builder
public record VenueListResponse(
        @Schema(description = "공연장 목록")
        List<VenueItemResponse> venues
) {
    public static VenueListResponse from(List<VenueDetailResult> results) {
        return VenueListResponse.builder()
                .venues(results.stream()
                        .map(VenueItemResponse::from)
                        .toList())
                .build();
    }
}
