package com.smu8.ticket.venue.http.request;

public record CreateVenueRequest(
        String name,
        String zoneNo,
        String roadAddress,
        String jibunAddress,
        String detailAddress,
        String buildingName
) {
}
