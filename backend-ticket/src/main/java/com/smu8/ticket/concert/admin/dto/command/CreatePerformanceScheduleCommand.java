package com.smu8.ticket.concert.admin.dto.command;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CreatePerformanceScheduleCommand(
        LocalDateTime date,
        LocalDateTime reservationEndAt,
        List<CreateSeatCommand> seats,
        Integer rowMax,
        Integer colMax
) {
}
