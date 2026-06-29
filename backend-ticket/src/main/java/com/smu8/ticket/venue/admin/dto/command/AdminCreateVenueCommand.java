package com.smu8.ticket.venue.admin.dto.command;

import lombok.Builder;

@Builder
public record AdminCreateVenueCommand(
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName
) {
}
