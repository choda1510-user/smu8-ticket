package com.smu8.ticket.auth.repository;

import org.springframework.security.oauth2.jwt.Jwt;

public interface TokenRepository {
    void activateRefreshToken(Jwt jwt);
    void deactivateRefreshToken(Jwt jwt);
    void addAccessTokenToBlacklist(Jwt jwt);
    long getRefreshTokenExpireSeconds();
    long getAccessTokenExpireSeconds();
    boolean checkAccessToken(Jwt jwt);
    boolean checkRefreshToken(Jwt jwt);
}
