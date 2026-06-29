package com.smu8.ticket.reservation.dto.result;

import com.smu8.ticket.concert.dto.result.PerformanceScheduleDetailResult;
import com.smu8.ticket.concert.dto.result.SeatGradeDetailResult;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import lombok.Builder;

import java.util.List;

@Builder
public record ReservationConcertSeatFrameResult(
        Long concertId,
        PerformanceScheduleDetailResult selectedSchedule,
        List<SeatGradeDetailResult> seatGrades,
        List<ConcertSeatStatusResult> seats
) {
    public static ReservationConcertSeatFrameResult from(PerformanceSchedule performanceSchedule, List<ConcertSeatStatusResult> seats) {
        return ReservationConcertSeatFrameResult.builder()
                .concertId(performanceSchedule.getConcert().getId())
                .selectedSchedule(PerformanceScheduleDetailResult.from(performanceSchedule))
                .seatGrades(performanceSchedule.getConcert().getSeatGrades().stream()
                        .map(SeatGradeDetailResult::from)
                        .toList())
                .seats(seats)
                .build();
    }
}
