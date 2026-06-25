package com.smu8.ticket.concert.dto.query;

import lombok.Builder;

@Builder
public record ConcertPageQuery(
        Integer page,
        Integer size
) {
}
