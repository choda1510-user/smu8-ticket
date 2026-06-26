package com.smu8.ticket.concert.admin.http.request;

import lombok.Builder;

@Builder
public record CreateSeatGradeRequest(
        String gradeName,
        Integer price,
        String color
) {
}
