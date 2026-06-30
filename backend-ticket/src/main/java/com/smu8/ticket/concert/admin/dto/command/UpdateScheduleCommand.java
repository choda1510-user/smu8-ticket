package com.smu8.ticket.concert.admin.dto.command;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UpdateScheduleCommand(
        Long id, // 기존 회차면 ID 있음, 새 회차면 null
        LocalDateTime date,
        LocalDateTime reservationEndAt
) {
}