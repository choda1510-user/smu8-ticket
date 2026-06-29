package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.admin.http.request.CreateSeatGradeRequest;

public record CreateSeatGradeCommand(
        String gradeName,
        Integer price,
        String color
) {
    public static CreateSeatGradeCommand from(CreateSeatGradeRequest request) {
        return new CreateSeatGradeCommand(
                request.gradeName(),
                request.price(),
                request.color()
        );
    }
}
