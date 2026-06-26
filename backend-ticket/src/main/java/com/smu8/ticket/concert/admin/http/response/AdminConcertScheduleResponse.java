package com.smu8.ticket.concert.admin.http.response;

import com.smu8.ticket.concert.http.response.SeatResponse;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record AdminConcertScheduleResponse(
        Long id,
        LocalDateTime date, // 공연날짜
        LocalDateTime reservationEndAt, // 예약 종료 시간
        List<SeatResponse> seats
) {
}
