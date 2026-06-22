package com.smu8.ticket.auth.dto.command;

import lombok.Builder;
import org.springframework.security.oauth2.jwt.Jwt;

@Builder
public record RegisterTokenCommand(
        Jwt accessToken,
        Jwt refreshToken
) {
}
