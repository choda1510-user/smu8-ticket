package com.smu8.ticket.venue.dto.command;

import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.http.request.UpdateVenueRequest;
import lombok.Builder;

@Builder
public record UpdateVenueCommand(
        String id,
        String name,
        String address,
        Integer capacity,
        String description
) {
    public static UpdateVenueCommand from(String id, UpdateVenueRequest request) {
        return UpdateVenueCommand.builder()
                .id(id)
                .name(request.name())
                .address(request.address())
                .capacity(request.capacity())
                .description(request.description())
                .build();
    }

    public void update(Venue venue) {
        venue.setName(name);
        venue.setAddress(address);
        venue.setCapacity(capacity);
        venue.setDescription(description);
    }
}
