package com.smu8.ticket.concert.admin.http.request;

import com.smu8.ticket.concert.admin.dto.command.UpdateScheduleCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateSeatGradeCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateSeatCommand;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record UpdateConcertBasicInfoRequest(
        @Schema(description = "수정할 공연 제목", example = "SM 콘서트 2026 앙코르")
        String title,
        @Schema(description = "수정할 공연 설명", example = "앙코르 공연 일정이 추가된 콘서트입니다.")
        String description,
        @Schema(description = "수정할 공연 러닝타임(분)", example = "150")
        String runningTime,
        @Schema(description = "수정할 공연 회차 목록 (기존 회차는 id 포함, 신규 회차는 id 생략)")
        List<UpdateScheduleCommand> schedules,
        @Schema(description = "수정할 좌석 등급 목록 (기존 등급은 id 포함, 신규 등급은 id 생략)")
        List<UpdateSeatGradeCommand> seatGrades,
        @Schema(description = "전체 회차에 동일하게 적용할 좌석 배치")
        List<UpdateSeatCommand> seats,
        @Schema(description = "좌석 배치 최대 행 수")
        Integer rowMax,
        @Schema(description = "좌석 배치 최대 열 수")
        Integer colMax
) {
}