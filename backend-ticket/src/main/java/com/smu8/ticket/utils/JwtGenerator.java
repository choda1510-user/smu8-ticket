package com.smu8.ticket.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@RequiredArgsConstructor
public class JwtGenerator {
    private final JwtEncoder jwtEncoder;
    private final String issuer;
    public Jwt generate(String userId, Instant expiresAt, Collection<? extends GrantedAuthority> authorities) {
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .subject(userId)
                .issuer(issuer)
                .expiresAt(expiresAt)
                .issuedAt(Instant.now())
                .claim("authorities", authorities)
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet));
    }
}
