package com.smu8.ticket.utils;

import com.smu8.ticket.auth.filter.RefreshTokenCookieAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;

@RequiredArgsConstructor
public class RefreshTokenUtils {
    public final boolean secure;
    public final long defaultMaxAge;
    public void setRefreshTokenCookie(HttpServletResponse response, Jwt refreshToken) {
        Instant issuedAt = refreshToken.getIssuedAt();
        Instant expiresAt = refreshToken.getExpiresAt();
        long maxAge;
        if (issuedAt == null || expiresAt == null) {
            maxAge = defaultMaxAge;
        }
        else {
            maxAge = expiresAt.minusSeconds(issuedAt.getEpochSecond()).getEpochSecond();
        }
        ResponseCookie cookie = ResponseCookie.from(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME, refreshToken.getTokenValue())
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

}
