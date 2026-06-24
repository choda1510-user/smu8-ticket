package com.smu8.ticket.auth.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class TokenRepositoryImpl implements TokenRepository {
    public final String REFRESH_TOKEN_PREFIX;
    public final String ACCESS_TOKEN_PREFIX;
    private final RedisTemplate<String, String> redisTicketTemplate;
    public final long accessTokenExpireSeconds;
    public final long refreshTokenExpireSeconds;

    public TokenRepositoryImpl(
            @Value("${token.refresh-token.prefix}")
            String REFRESH_TOKEN_PREFIX,
            @Value("${token.access-token.prefix}")
            String ACCESS_TOKEN_PREFIX,
            @Autowired
            RedisTemplate<String, String> redisTicketTemplate,
            @Value("${token.access-token.expire}")
            long accessTokenExpireSeconds,
            @Value("${token.refresh-token.expire}")
            long refreshTokenExpireSeconds) {
        this.REFRESH_TOKEN_PREFIX = REFRESH_TOKEN_PREFIX;
        this.ACCESS_TOKEN_PREFIX = ACCESS_TOKEN_PREFIX;
        this.redisTicketTemplate = redisTicketTemplate;
        this.accessTokenExpireSeconds = accessTokenExpireSeconds;
        this.refreshTokenExpireSeconds = refreshTokenExpireSeconds;
    }


    @Override
    public void activateRefreshToken(Jwt jwt) {
        ValueOperations<String, String> ops = redisTicketTemplate.opsForValue();
        ops.set(REFRESH_TOKEN_PREFIX + jwt.getSubject(), jwt.getId(), Duration.ofSeconds(refreshTokenExpireSeconds));
    }

    @Override
    public void deactivateRefreshToken(Jwt jwt) {
        ValueOperations<String, String> ops = redisTicketTemplate.opsForValue();
        if (jwt == null) {
            throw new RuntimeException();
        }
        if (jwt.getId() == null) {
            throw new RuntimeException();
        }
        ops.getAndDelete(REFRESH_TOKEN_PREFIX + jwt.getSubject());
    }

    @Override
    public void addAccessTokenToBlacklist(Jwt jwt) {
        ValueOperations<String, String> ops = redisTicketTemplate.opsForValue();
        if (jwt == null) {
            throw new RuntimeException();
        }
        if (jwt.getId() == null) {
            throw new RuntimeException();
        }
        if (jwt.getExpiresAt() == null || jwt.getIssuedAt() == null) {
            throw new RuntimeException();
        }
        ops.set(ACCESS_TOKEN_PREFIX + jwt.getSubject() + ":" + jwt.getId(), jwt.getId(), Duration.ofSeconds(accessTokenExpireSeconds));
    }

    @Override
    public long getRefreshTokenExpireSeconds() {
        return refreshTokenExpireSeconds;
    }

    @Override
    public long getAccessTokenExpireSeconds() {
        return accessTokenExpireSeconds;
    }

    @Override
    public boolean checkAccessToken(Jwt jwt) {
        return redisTicketTemplate.hasKey(ACCESS_TOKEN_PREFIX + jwt.getSubject() + ":" + jwt.getId());
    }

    @Override
    public boolean checkRefreshToken(Jwt jwt) {
        return redisTicketTemplate.hasKey(REFRESH_TOKEN_PREFIX + jwt.getSubject());
    }
}
