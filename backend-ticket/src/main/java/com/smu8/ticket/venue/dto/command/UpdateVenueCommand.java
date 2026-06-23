package com.smu8.ticket.venue.dto.command;

import com.smu8.ticket.venue.http.request.UpdateVenueRequest;
import lombok.Builder;

@Builder
public record UpdateVenueCommand(
        Long id,
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName
) {
    public static UpdateVenueCommand from(Long id, UpdateVenueRequest request) {
        return UpdateVenueCommand.builder()
                .id(id)
                .name(request.name())
                .zoneNo(request.zoneNo())
                .roadAddress(request.roadAddress())
                .jibunAddress(request.jibunAddress())
                .detailAddress(request.detailAddress())
                .buildingName(request.buildingName())
                .build();
    }
}
