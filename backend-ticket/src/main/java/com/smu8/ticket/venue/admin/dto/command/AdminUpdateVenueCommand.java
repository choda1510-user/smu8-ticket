package com.smu8.ticket.venue.admin.dto.command;

import com.smu8.ticket.venue.admin.http.request.AdminUpdateVenueRequest;
import lombok.Builder;

@Builder
public record AdminUpdateVenueCommand(
        Long id,
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName
) {
    public static AdminUpdateVenueCommand from(Long id, AdminUpdateVenueRequest request) {
        return AdminUpdateVenueCommand.builder()
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
