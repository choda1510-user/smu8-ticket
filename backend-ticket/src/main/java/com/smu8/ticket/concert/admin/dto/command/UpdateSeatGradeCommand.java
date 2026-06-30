package com.smu8.ticket.concert.admin.dto.command;

import lombok.Builder;

@Builder
public record UpdateSeatGradeCommand(
        Long id, // 기존 등급이면 ID 있음, 새 등급이면 null
        String gradeName,
        Integer price,
        String color
) {
}