package com.smu8.ticket.concert.dto.query;

import com.smu8.ticket.dto.query.PageQuery;
import lombok.Builder;

import java.util.List;

@Builder
public record ConcertPageQuery(
        PageQuery pageQuery,
        List<String> concertNames,
        String status,
        String venueCode,
        String venueNames
) {
}
