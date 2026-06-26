package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.ConcertScheduleResponse;
import com.smu8.ticket.concert.http.response.SeatGradeResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Builder
public record ReservationConcertSeatFrameResponse(
        @Schema(description = "공연 고유 Id")
        Long concertId,
        @Schema(description = "선택한 공연 회차")
        ConcertScheduleResponse selectSchedule,
        @Schema(description = "좌석 타입 목록")
        List<SeatGradeResponse> seatGrades,
        @Schema(description = "예매 좌석 목록")
        List<ReservationSeatResponse> seats
) {
}
