package com.smu8.ticket.waiting.provider;

import com.smu8.ticket.waiting.authentication.WaitingActiveAccountAuthentication;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
@Profile({"dev-waiting", "local-dev-waiting", "test-waiting", "load-test-waiting", "local-test-waiting"})
public class WaitingActiveAccountProvider implements AuthenticationProvider {
    private static final String KEY_PREFIX = "waiting:concert:active-account:";

    private final RedisTemplate<String, String> concertPassedUserRedisTemplate;

    public WaitingActiveAccountProvider(
            @Qualifier("concertPassedUserRedisTemplate")
            RedisTemplate<String, String> concertPassedUserRedisTemplate
    ) {
        this.concertPassedUserRedisTemplate = concertPassedUserRedisTemplate;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        WaitingActiveAccountAuthentication waitingAuthentication =
                (WaitingActiveAccountAuthentication) authentication;

        String concertId = waitingAuthentication.getConcertId();
        String accountId = waitingAuthentication.getName();
        if (!isActive(concertId, accountId)) {
            throw new BadCredentialsException("Waiting queue was not passed.");
        }

        return WaitingActiveAccountAuthentication.authenticated(concertId, accountId);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return WaitingActiveAccountAuthentication.class.isAssignableFrom(authentication);
    }

    private boolean isActive(String concertId, String accountId) {
        removeExpired(concertId);
        return concertPassedUserRedisTemplate.opsForZSet().score(key(concertId), accountId) != null;
    }

    private void removeExpired(String concertId) {
        concertPassedUserRedisTemplate.opsForZSet().removeRangeByScore(
                key(concertId),
                Double.NEGATIVE_INFINITY,
                System.currentTimeMillis()
        );
    }

    private String key(String concertId) {
        return KEY_PREFIX + concertId;
    }
}
