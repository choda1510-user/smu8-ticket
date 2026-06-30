package com.smu8.ticket.concert.admin.dto.command;

import lombok.Builder;

@Builder
public record UpdateSeatCommand(
        String seatGradeName,
        Integer row,
        Integer col
) {
}