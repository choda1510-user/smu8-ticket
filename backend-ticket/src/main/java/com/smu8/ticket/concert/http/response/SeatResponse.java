package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.SeatDetailResult;
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
        public static SeatResponse from(SeatDetailResult result) {
                return SeatResponse.builder()
                        .id(result.id())
                        .seatGradeId(result.seatGrade().id())
                        .row(result.rowIndex())
                        .col(result.columnIndex())
                        .build();
        }
}
