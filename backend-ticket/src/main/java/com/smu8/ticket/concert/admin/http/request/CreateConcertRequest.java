package com.smu8.ticket.concert.admin.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

public record CreateConcertRequest(
        @Schema(description = "공연 제목", example = "SM 콘서트 2026")
        String title,
        @Schema(description = "공연 설명", example = "대표 아티스트들이 함께하는 라이브 콘서트입니다.")
        String description,
        @Schema(description = "공연 시간")
        String runningTime,
        @Schema(description = "예매 시작일시", example = "2026-07-01T19:00:00")
        LocalDateTime reservationStartAt,
        @Schema(description = "공연장 고유 ID", example = "1")
        Long venueId,
        @Schema(description = "공지사항")
        String notice,
        @Schema(description = "좌석 종류 목록")
        List<CreateSeatGradeRequest> seatGrades,
        @Schema(description = "공연 회차 목록")
        List<CreateConcertScheduleRequest> schedules,
        @Schema(description = "좌석 목록")
        List<CreateSeatRequest> seats,
        @Schema(description = "행 개수")
        Integer rowMax,
        @Schema(description = "열 개수")
        Integer colMax
) {
}
