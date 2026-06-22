package com.smu8.ticket.venue.dto.command;

import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.http.request.CreateVenueRequest;
import lombok.Builder;

@Builder
public record CreateVenueCommand(
        String name,
        String address,
        Integer capacity,
        String description
) {
    public static CreateVenueCommand from(CreateVenueRequest request) {
        return CreateVenueCommand.builder()
                .name(request.name())
                .address(request.address())
                .capacity(request.capacity())
                .description(request.description())
                .build();
    }

    public Venue byId(String id) {
        return Venue.builder()
                .id(id)
                .name(name)
                .address(address)
                .capacity(capacity)
                .description(description)
                .build();
    }
}
