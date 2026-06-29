package com.smu8.ticket.concert.dto.result;

import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import lombok.Builder;

@Builder
public record SeatDetailResult (
        Long id,
        PerformanceSchedule performanceSchedule,
        SeatGradeDetailResult seatGrade,
        Integer rowIndex,
        Integer columnIndex
){
        public static SeatDetailResult from(Seat seat){
            return SeatDetailResult.builder()
                    .id(seat.getId())
                    .performanceSchedule(seat.getPerformanceSchedule())
                    .seatGrade(SeatGradeDetailResult.from(seat.getSeatGrade()))
                    .rowIndex(seat.getRowIndex())
                    .columnIndex(seat.getColumnIndex())
                    .build();

        }
}
