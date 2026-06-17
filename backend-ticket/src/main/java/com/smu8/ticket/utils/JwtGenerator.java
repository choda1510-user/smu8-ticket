package com.smu8.ticket.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;
import java.util.UUID;

@RequiredArgsConstructor
public class JwtGenerator {
    private final JwtEncoder jwtEncoder;
    public Jwt generate(Authentication authentication) {
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .subject(authentication.getName())
                .issuer("http://localhost:8080")
                .expiresAt(Instant.now().plusSeconds(30 * 60))
                .issuedAt(Instant.now())
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet));
    }
}
