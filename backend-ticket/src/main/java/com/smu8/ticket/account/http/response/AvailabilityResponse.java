package com.smu8.ticket.account.http.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record AvailabilityResponse(
        @Schema(description = "사용 가능 여부. true면 사용 가능, false면 중복 또는 사용 불가", example = "true")
        boolean available
) {
}
