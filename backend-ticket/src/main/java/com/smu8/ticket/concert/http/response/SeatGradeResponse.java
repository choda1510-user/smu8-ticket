package com.smu8.ticket.concert.http.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record SeatGradeResponse(
        @Schema(description = "좌석등급 Id")
        Long id,
        @Schema(description = "좌석등급 이름")
        String gradeName,
        @Schema(description = "좌석등급 가격")
        Integer price,
        @Schema(description = " 좌석등급 색", example = "#fafafa")
        String color
) {
}
