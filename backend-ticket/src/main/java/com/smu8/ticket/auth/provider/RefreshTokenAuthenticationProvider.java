package com.smu8.ticket.auth.provider;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.service.AccountAuthenticationService;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.exception.RefreshTokenAuthenticationException;
import com.smu8.ticket.auth.service.TokenService;
import com.smu8.ticket.authentication.Authority;
import com.smu8.ticket.authentication.RefreshTokenAuthenticationToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class RefreshTokenAuthenticationProvider implements AuthenticationProvider {

    private final JwtDecoder jwtDecoder;
    private final AccountAuthenticationService accountAuthenticationService;
    private final TokenService tokenService;

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        String refreshTokenValue = (String) authentication.getCredentials();

        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            throw new RefreshTokenAuthenticationException("Refresh token is empty.");
        }

        Jwt jwt = null;
        try {
            jwt = jwtDecoder.decode(refreshTokenValue);
        } catch (JwtException e) {
            throw new RefreshTokenAuthenticationException("Refresh token is invalid.", e);
        }

        if (!tokenService.checkRefreshToken(TokenQuery.builder().jti(jwt.getId()).sub(jwt.getSubject()).build())) {
            throw new RefreshTokenAuthenticationException("Refresh token is expired.");
        }

        AccountDetailResult accountDetailResult = accountAuthenticationService.getById(jwt.getSubject());

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(Authority.REFRESH_TOKEN.toString()));
        if (accountDetailResult.admin()) {
            grantedAuthorities.add(new SimpleGrantedAuthority(Authority.ADMIN.toString()));
        }

        return new RefreshTokenAuthenticationToken(
                accountDetailResult,
                refreshTokenValue,
                grantedAuthorities
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return RefreshTokenAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
