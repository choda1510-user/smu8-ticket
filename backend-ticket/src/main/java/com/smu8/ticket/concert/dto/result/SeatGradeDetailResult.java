package com.smu8.ticket.concert.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import lombok.Builder;

@Builder
public record SeatGradeDetailResult (
        Long id,
        Concert concert,
        String gradeName,
        Integer price,
        String color
){
    public static SeatGradeDetailResult from(SeatGrade seatGrade){
        return SeatGradeDetailResult.builder()
                .id(seatGrade.getId())
                .concert(seatGrade.getConcert())
                .gradeName(seatGrade.getGradeName())
                .price(seatGrade.getPrice())
                .color(seatGrade.getColor())
                .build();
    }
}
