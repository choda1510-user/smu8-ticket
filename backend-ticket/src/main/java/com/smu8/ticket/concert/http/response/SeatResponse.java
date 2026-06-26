package com.smu8.ticket.concert.http.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record SeatResponse(
        @Schema(description = " 좌석 Id")
        Long id,
        @Schema(description = "좌석등급 Id")
        Long seatGradeId,
        @Schema(description = "좌석 행 위치")
        Integer row,
        @Schema(description = "좌석 열 위치")
        Integer col
) {
}
