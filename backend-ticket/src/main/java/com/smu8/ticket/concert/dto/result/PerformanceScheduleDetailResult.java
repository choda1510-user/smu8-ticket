package com.smu8.ticket.concert.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
public record PerformanceScheduleDetailResult (
        Long id,
        Concert concert,
        LocalDateTime showStartAt,
        LocalDateTime reservationStartAt,
        LocalDateTime reservationEndAt,
        Integer seatColumnCount,
        Integer seatRowCount
){
    public static PerformanceScheduleDetailResult from(PerformanceSchedule performanceSchedule){
        return PerformanceScheduleDetailResult.builder()
                .id(performanceSchedule.getId())
                .concert(performanceSchedule.getConcert())
                .showStartAt(performanceSchedule.getShowStartAt())
                .reservationStartAt(performanceSchedule.getReservationStartAt())
                .reservationEndAt(performanceSchedule.getReservationEndAt())
                .seatColumnCount(performanceSchedule.getSeatColumnCount())
                .seatRowCount(performanceSchedule.getSeatRowCount())
                .build();
    }
}
