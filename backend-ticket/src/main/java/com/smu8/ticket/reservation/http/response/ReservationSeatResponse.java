package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.SeatResponse;
import com.smu8.ticket.reservation.dto.result.ReservationSeatDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record ReservationSeatResponse(
        @Schema(description = "예매 좌석 고유 Id")
        Long id,
        @Schema(description = "좌석")
        SeatResponse seat,
        @Schema(description = "좌석 상태")
        SeatStatus status
) {
    public static ReservationSeatResponse from(ReservationSeatDetailResult result) {
        return ReservationSeatResponse.builder()
                .id(result.id())
                .seat(SeatResponse.from(result.seat()))
                .status(SeatStatus.SELECTED)
                .build();
    }
}
