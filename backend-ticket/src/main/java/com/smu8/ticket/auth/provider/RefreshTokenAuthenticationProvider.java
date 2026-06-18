package com.smu8.ticket.auth.provider;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.service.AccountAuthenticationService;
import com.smu8.ticket.auth.exception.RefreshTokenAuthenticationException;
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

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class RefreshTokenAuthenticationProvider implements AuthenticationProvider {

    private final JwtDecoder jwtDecoder;
    private final AccountAuthenticationService accountAuthenticationService;

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        String refreshTokenValue = (String) authentication.getCredentials();

        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            throw new RefreshTokenAuthenticationException("Refresh token is empty.");
        }

        Jwt jwt = jwtDecoder.decode(refreshTokenValue);

        AccountDetailResult accountDetailResult = accountAuthenticationService.getById(jwt.getSubject());

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(Authority.REFRESH_TOKEN.toString()));

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