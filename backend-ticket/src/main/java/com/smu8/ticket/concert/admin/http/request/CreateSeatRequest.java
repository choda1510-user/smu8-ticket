package com.smu8.ticket.concert.admin.http.request;

import lombok.Builder;

@Builder
public record CreateSeatRequest(
        String seatGradeName,
        Integer row,
        Integer col
) {
}
