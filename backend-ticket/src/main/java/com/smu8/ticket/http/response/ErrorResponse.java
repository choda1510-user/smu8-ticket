package com.smu8.ticket.http.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
public record ErrorResponse(
        @Schema(description = "에러 코드", example = "DUPLICATE_USERNAME")
        ErrorCode code,
        @Schema(description = "에러 메시지", example = "이미 사용 중인 아이디입니다.")
        String message
) {
}
