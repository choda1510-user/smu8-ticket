package com.smu8.ticket.auth.service;

import com.smu8.ticket.auth.dto.command.CreateTokenCommand;
import com.smu8.ticket.auth.dto.command.RegisterTokenCommand;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.dto.result.BlacklistTokenResult;
import com.smu8.ticket.auth.dto.result.TokenResult;
import com.smu8.ticket.authentication.Authority;
import com.smu8.ticket.utils.JwtGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.RedisConnectionFactory;
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
    public final String REFRESH_TOKEN_PREFIX = "refresh-token:";
    private final JwtGenerator jwtGenerator;
    private final RedisTemplate<String, String> redisTemplate;
    private final long accessTokenExpireSeconds = 60 * 60;
    private final long refreshTokenExpireSeconds = 2 * 60 * 60;
    @Override
    public TokenResult createToken(CreateTokenCommand command) {
        Instant expiresAt = Instant.now().plusSeconds(accessTokenExpireSeconds);
        Jwt jwt = jwtGenerator.generate(command.userId(),expiresAt, command.authorities());
        if (command.authorities().contains(new SimpleGrantedAuthority(Authority.REFRESH_TOKEN.toString()))) {
            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            ops.set(REFRESH_TOKEN_PREFIX + jwt.getSubject(), jwt.getId(), Duration.ofSeconds(refreshTokenExpireSeconds));
        }
        return TokenResult.builder()
                .jwt(jwt)
                .build();
    }

    @Override
    public BlacklistTokenResult setBlacklistToken(RegisterTokenCommand command) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        Jwt accessToken = command.accessToken();
        if (accessToken == null) {
            throw new RuntimeException();
        }
        if (accessToken.getId() == null) {
            throw new RuntimeException();
        }
        if (accessToken.getExpiresAt() == null || accessToken.getIssuedAt() == null) {
            throw new RuntimeException();
        }
        ops.set(accessToken.getId(), accessToken.getId(), Duration.ofSeconds(accessTokenExpireSeconds));
        Jwt refreshToken = command.refreshToken();
        if (refreshToken == null) {
            throw new RuntimeException();
        }
        if (refreshToken.getId() == null) {
            throw new RuntimeException();
        }
        ops.getAndDelete(REFRESH_TOKEN_PREFIX + refreshToken.getSubject());
        return BlacklistTokenResult.builder()
                .accessTokenId(accessToken.getId())
                .refreshTokenId(refreshToken.getId())
                .build();
    }
    @Override
    public Boolean checkAccessToken(TokenQuery query) {
        return redisTemplate.hasKey(query.jti());
    }
    @Override
    public Boolean checkRefreshToken(TokenQuery query) {
        return redisTemplate.hasKey(REFRESH_TOKEN_PREFIX + query.sub());
    }
}
