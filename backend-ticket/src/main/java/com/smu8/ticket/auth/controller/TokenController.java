package com.smu8.ticket.auth.controller;

import com.smu8.ticket.auth.dto.command.CreateTokenCommand;
import com.smu8.ticket.auth.dto.command.RegisterTokenCommand;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.service.TokenService;
import com.smu8.ticket.authentication.Authority;
import com.smu8.ticket.utils.RefreshTokenUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequiredArgsConstructor
public class TokenController {
    private final TokenService tokenService;
    private final RefreshTokenUtils refreshTokenUtils;
    // 리프레시 토큰은 http-only 쿠키에
    @Operation(summary = "token", security= @SecurityRequirement(name = "Authorization"))
    @GetMapping("/api/token")
    public ResponseEntity<Jwt> token(Authentication authentication, HttpServletResponse response) {
        refreshTokenUtils.setRefreshTokenCookie(response, tokenService.createToken(CreateTokenCommand.builder()
                .userId(authentication.getName())
                .role(role(authentication))
                .authorities(List.of(new SimpleGrantedAuthority(Authority.REFRESH_TOKEN.toString())))
                .build()).jwt());
        return ResponseEntity
                .ok(tokenService.createToken(CreateTokenCommand.builder()
                        .userId(authentication.getName())
                        .role(role(authentication))
                        .authorities(accessTokenAuthorities(authentication))
                        .build()).jwt());
    }
    // 엑세스 토큰을 다시 받는 api
    @GetMapping("/api/refresh")
    public ResponseEntity<Jwt> refresh(Authentication authentication) {
        return ResponseEntity
                .ok(tokenService.createToken(CreateTokenCommand.builder()
                        .userId(authentication.getName())
                        .role(role(authentication))
                        .authorities(accessTokenAuthorities(authentication))
                        .build()).jwt());
    }
    @Operation(summary = "logout", security= @SecurityRequirement(name = "Authorization"))
    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        refreshTokenUtils.deleteRefreshTokenCookie(response);
        // 레디스에 엑세스 토큰을 블랙리스트로 등록해야 함
        tokenService.setBlacklistToken(RegisterTokenCommand.builder()
                        .accessToken(refreshTokenUtils.getAccessTokenHeader(request))
                        .refreshToken(refreshTokenUtils.getRefreshTokenCookie(request))
                .build());
        return ResponseEntity.noContent().build();
    }

    private String role(Authentication authentication) {
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(authority -> Authority.ADMIN.toString().equals(authority.getAuthority()));
        return admin ? "admin" : "user";
    }

    private List<GrantedAuthority> accessTokenAuthorities(Authentication authentication) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(Authority.ACCESS_TOKEN.toString()));
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(authority -> Authority.ADMIN.toString().equals(authority.getAuthority()));
        if (admin) {
            authorities.add(new SimpleGrantedAuthority(Authority.ADMIN.toString()));
        }
        return authorities;
    }
}
