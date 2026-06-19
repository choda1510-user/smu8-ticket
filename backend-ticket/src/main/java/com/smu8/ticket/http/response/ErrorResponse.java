package com.smu8.ticket.http.response;

import lombok.Builder;

@Builder
public record ErrorResponse(
        ErrorCode code,
        String message
) {
}
