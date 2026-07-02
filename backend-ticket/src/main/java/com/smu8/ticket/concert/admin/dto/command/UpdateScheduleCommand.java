package com.smu8.ticket.concert.admin.dto.command;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UpdateScheduleCommand(
        Long id, // 기존 회차면 ID 있음, 새 회차면 null
        LocalDateTime date,
        LocalDateTime reservationEndAt
) {
    // ★ 추가: 값이 있으면 그대로 사용(연장 등), 없으면 공연시작일 00:00 자동 계산
    public LocalDateTime resolvedReservationEndAt() {
        return reservationEndAt != null
                ? reservationEndAt
                : date.toLocalDate().atStartOfDay();
}
}