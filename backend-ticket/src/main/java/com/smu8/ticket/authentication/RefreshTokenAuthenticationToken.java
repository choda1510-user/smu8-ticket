package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class RefreshTokenAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal;
    private final String refreshToken;

    public RefreshTokenAuthenticationToken(String refreshToken) {
        super((Collection<? extends GrantedAuthority>) null);
        this.principal = null;
        this.refreshToken = refreshToken;
        setAuthenticated(false);
    }

    public RefreshTokenAuthenticationToken(
            Object principal,
            String refreshToken,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(authorities);
        this.principal = principal;
        this.refreshToken = refreshToken;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return refreshToken;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
    public String getUserId() {
        AccountDetailResult accountDetailResult = (AccountDetailResult) principal;
        return accountDetailResult.id();
    }
    @Override
    public String getName() {
        return getUserId();
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}