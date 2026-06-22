package com.smu8.ticket.venue.http.request;

public record CreateVenueRequest(
        String name,
        String address,
        Integer capacity,
        String description
) {
}
