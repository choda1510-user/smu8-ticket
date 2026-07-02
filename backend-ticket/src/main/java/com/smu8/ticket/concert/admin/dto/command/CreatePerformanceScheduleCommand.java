package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.admin.http.request.CreateConcertScheduleRequest;
import com.smu8.ticket.concert.admin.http.request.CreateSeatRequest;
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
    public static CreatePerformanceScheduleCommand from(
            CreateConcertScheduleRequest request,
            List<CreateSeatRequest> seatRequests,
            Integer rowMax,
            Integer colMax
    ) {
        List<CreateSeatCommand> seats = seatRequests == null
                ? List.of()
                : seatRequests.stream()
                .map(CreateSeatCommand::from)
                .toList();

        return CreatePerformanceScheduleCommand.builder()
                .date(request.date())
                .reservationEndAt(request.reservationEndAt())
                .seats(seats)
                .rowMax(rowMax)
                .colMax(colMax)
                .build();
    }
    // ★ 추가: 값이 있으면 그대로 사용(추가오픈 시 연장 등), 없으면 공연시작일 00:00 자동 계산
    public LocalDateTime resolvedReservationEndAt() {
        return reservationEndAt != null
                ? reservationEndAt
                : date.toLocalDate().atStartOfDay();
    }
}
