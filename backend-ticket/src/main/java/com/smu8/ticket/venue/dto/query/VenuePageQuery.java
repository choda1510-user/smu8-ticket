package com.smu8.ticket.venue.dto.query;

import com.smu8.ticket.dto.query.PageQuery;
import lombok.Builder;

import java.util.List;

@Builder
public record VenuePageQuery(
        PageQuery pageQuery,
        List<String> venueNames
) {
}
