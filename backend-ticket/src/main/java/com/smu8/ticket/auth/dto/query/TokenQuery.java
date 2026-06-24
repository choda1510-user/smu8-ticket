package com.smu8.ticket.auth.dto.query;

import lombok.Builder;

@Builder
public record TokenQuery(
        String jti,
        String sub
) {
}
