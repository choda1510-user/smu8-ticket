package com.smu8.ticket.venue.dto.query;

import lombok.Builder;

@Builder
public record VenuePageQuery(
        Integer page,
        Integer size
) {
}
