package com.smu8.ticket.concert.admin.dto.command;

public record CreateSeatGradeCommand(
        String gradeName,
        Integer price,
        String color
) {
}
