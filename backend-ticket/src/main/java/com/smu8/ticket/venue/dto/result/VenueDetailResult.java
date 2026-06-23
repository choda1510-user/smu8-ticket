package com.smu8.ticket.venue.dto.result;

import com.smu8.ticket.venue.entity.Address;
import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record VenueDetailResult(
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
    public static VenueDetailResult from(Venue venue) {
        Address address = venue.getAddress();
        return VenueDetailResult.builder()
                .id(venue.getId())
                .name(venue.getName())
                .zoneNo(address.getZoneNo())
                .roadAddress(address.getRoadAddress())
                .jibunAddress(address.getJibunAddress())
                .detailAddress(address.getDetailAddress())
                .buildingName(address.getBuildingName())
                .createdAt(venue.getCreatedAt())
                .updatedAt(venue.getUpdatedAt())
                .build();
    }
}
