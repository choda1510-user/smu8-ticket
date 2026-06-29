package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.admin.http.request.CreateSeatRequest;

public record CreateSeatCommand(
        String seatGradeName,
        Integer row,
        Integer col
) {
    public static CreateSeatCommand from(CreateSeatRequest request) {
        return new CreateSeatCommand(
                request.seatGradeName(),
                request.row(),
                request.col()
        );
    }
}
