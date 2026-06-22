package com.smu8.ticket.auth.service;

import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.dto.result.TokenResult;
import com.smu8.ticket.utils.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final JwtGenerator jwtGenerator;
    @Override
    public TokenResult getToken(TokenQuery query) {
        Instant expiresAt = Instant.now().plusSeconds(60 * 60);
        return TokenResult.builder()
                .jwt(jwtGenerator.generate(query.userId(), query.role(), expiresAt, query.authorities()))
                .build();
    }
}
