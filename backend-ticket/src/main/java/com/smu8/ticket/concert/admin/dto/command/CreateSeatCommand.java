package com.smu8.ticket.concert.admin.dto.command;

public record CreateSeatCommand(
        String seatGradeName,
        Integer row,
        Integer col
) {
}
