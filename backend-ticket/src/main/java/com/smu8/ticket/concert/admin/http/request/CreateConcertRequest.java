package com.smu8.ticket.concert.admin.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public record CreateConcertRequest(
        @Schema(description = "공연 제목", example = "SM 콘서트 2026")
        String title,
        @Schema(description = "공연 설명", example = "대표 아티스트들이 함께하는 라이브 콘서트입니다.")
        String description,
        @Schema(description = "공연 시작일시", example = "2026-07-01T19:00:00")
        LocalDateTime startAt,
        @Schema(description = "공연장 고유 ID", example = "1")
        Long venueId,
        List<CreateSeatGradeRequest> seatGrades,
        List<CreateConcertScheduleRequest> schedules,
        List<CreateSeatRequest> seats,
        Integer rowMax,
        Integer colMax
) {
}
