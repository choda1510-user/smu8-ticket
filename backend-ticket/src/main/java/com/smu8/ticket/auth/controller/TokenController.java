package com.smu8.ticket.auth.controller;

import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.service.TokenService;
import com.smu8.ticket.utils.RefreshTokenUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TokenController {
    private final TokenService tokenService;
    private final RefreshTokenUtils refreshTokenUtils;
    // 리프레시 토큰은 http-only 쿠키에
    @GetMapping("/api/token")
    public ResponseEntity<Jwt> token(Authentication authentication, HttpServletResponse response) {
        refreshTokenUtils.setRefreshTokenCookie(response, tokenService.getToken(TokenQuery.builder()
                .userId(authentication.getName())
                .authorities(authentication.getAuthorities())
                .build()).jwt());
        return ResponseEntity
                .ok(tokenService.getToken(TokenQuery.builder()
                        .userId(authentication.getName())
                        .authorities(authentication.getAuthorities())
                        .build()).jwt());
    }
    // 엑세스 토큰을 다시 받는 api
    @GetMapping("/api/refresh")
    public ResponseEntity<Jwt> refresh(Authentication authentication) {
        return ResponseEntity
                .ok(tokenService.getToken(TokenQuery.builder()
                        .userId(authentication.getName())
                        .authorities(authentication.getAuthorities())
                        .build()).jwt());
    }
    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(Authentication authentication, HttpServletResponse response) {
        refreshTokenUtils.deleteRefreshTokenCookie(response);
        // 레디스에 리프레시 토큰과 엑세스 토큰을 블랙리스트로 등록해야 함
        return ResponseEntity.noContent().build();
    }
}
