package com.smu8.ticket.venue.dto.command;

import lombok.Builder;

@Builder
public record CreateVenueCommand(
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName
) {
}
