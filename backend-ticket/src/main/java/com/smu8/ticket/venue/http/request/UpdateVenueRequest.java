package com.smu8.ticket.venue.http.request;

public record UpdateVenueRequest(
        String name,
        String address,
        Integer capacity,
        String description
) {
}
