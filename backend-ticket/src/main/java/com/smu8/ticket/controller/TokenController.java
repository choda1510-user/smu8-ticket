package com.smu8.ticket.controller;

import com.smu8.ticket.utils.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenController {
    private final JwtGenerator jwtGenerator;
    @GetMapping
    public ResponseEntity<Jwt> token(Authentication authentication) {
        return ResponseEntity.ok(jwtGenerator.generate(authentication));
    }
}
