package com.smu8.ticket.auth.dto.query;

import lombok.Builder;
import org.springframework.security.oauth2.jwt.Jwt;

@Builder
public record TokenQuery(
        String jti,
        String sub,
        Jwt jwt
) {
}
