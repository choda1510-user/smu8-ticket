package com.smu8.ticket.auth.dto.result;

import lombok.Builder;
import org.springframework.security.oauth2.jwt.Jwt;

@Builder
public record TokenResult(
        Jwt jwt
) {
}
