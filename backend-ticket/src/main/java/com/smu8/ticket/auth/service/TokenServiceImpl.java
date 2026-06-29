package com.smu8.ticket.auth.service;

import com.smu8.ticket.auth.dto.command.CreateTokenCommand;
import com.smu8.ticket.auth.dto.command.RegisterTokenCommand;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.dto.result.BlacklistTokenResult;
import com.smu8.ticket.auth.dto.result.TokenResult;
import com.smu8.ticket.auth.repository.TokenRepository;
import com.smu8.ticket.authentication.Authority;
import com.smu8.ticket.utils.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final JwtGenerator jwtGenerator;
    private final TokenRepository tokenRepository;
    @Override
    public TokenResult createToken(CreateTokenCommand command) {
        Instant expiresAt = Instant.now().plusSeconds(tokenRepository.getAccessTokenExpireSeconds());
        Jwt jwt = jwtGenerator.generate(command.userId(), command.role(), expiresAt, command.authorities());
        if (command.authorities().contains(new SimpleGrantedAuthority(Authority.REFRESH_TOKEN.toString()))) {
            tokenRepository.activateRefreshToken(jwt);
        }
        return TokenResult.builder()
                .jwt(jwt)
                .build();
    }

    @Override
    public BlacklistTokenResult setBlacklistToken(RegisterTokenCommand command) {
        tokenRepository.addAccessTokenToBlacklist(command.accessToken());
        tokenRepository.deactivateRefreshToken(command.refreshToken());
        return BlacklistTokenResult.builder()
                .accessTokenId(command.accessToken().getId())
                .refreshTokenId(command.refreshToken().getId())
                .build();
    }
    @Override
    public Boolean checkAccessToken(TokenQuery query) {
        return tokenRepository.checkAccessToken(query.jwt());
    }
    @Override
    public Boolean checkRefreshToken(TokenQuery query) {
        return tokenRepository.checkRefreshToken(query.jwt());
    }
}
