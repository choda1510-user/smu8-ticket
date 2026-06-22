package com.smu8.ticket.venue.http.response;

import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record VenueDetailResponse(
        Long id,
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static VenueDetailResponse from(VenueDetailResult result) {
        return VenueDetailResponse.builder()
                .id(result.id())
                .name(result.name())
                .zoneNo(result.zoneNo())
                .roadAddress(result.roadAddress())
                .jibunAddress(result.jibunAddress())
                .detailAddress(result.detailAddress())
                .buildingName(result.buildingName())
                .createdAt(result.createdAt())
                .updatedAt(result.updatedAt())
                .build();
    }
}
