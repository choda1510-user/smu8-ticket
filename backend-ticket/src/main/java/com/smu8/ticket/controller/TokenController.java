package com.smu8.ticket.controller;

import com.smu8.ticket.utils.JwtGenerator;
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
    private final JwtGenerator jwtGenerator;
    // 리프레시 토큰은 security 쿠키에
    @GetMapping("/api/token")
    public ResponseEntity<Jwt> token(Authentication authentication) {
        return ResponseEntity.ok(jwtGenerator.generate(authentication));
    }
    // 엑세스 토큰을 다시 받는 api
    @GetMapping("/api/refresh")
    public ResponseEntity<Jwt> refresh(Authentication authentication) {
        return ResponseEntity.ok(jwtGenerator.generate(authentication));
    }
    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(Authentication authentication) {
        // 레디스에 리프레시 토큰과 엑세스 토큰을 블랙리스트로 등록해야 함
        return ResponseEntity.noContent().build();
    }
}
