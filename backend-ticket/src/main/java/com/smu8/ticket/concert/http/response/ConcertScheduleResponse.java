package com.smu8.ticket.concert.http.response;

import lombok.Builder;

import java.time.LocalDateTime;

// 공연회차
// PerformanceSchedule
@Builder
public record ConcertScheduleResponse(
        Long id,
        LocalDateTime date, // 공연날짜
        LocalDateTime reservationEndAt // 예약 종료 시간
) {
}
