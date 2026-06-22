package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class AccountAuthentication extends AbstractAuthenticationToken {
    private final AccountDetailResult accountDetailResult;
    private boolean authenticated;

    public AccountAuthentication(AccountDetailResult accountDetailResult, boolean authenticated, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.accountDetailResult = accountDetailResult;
        this.authenticated = authenticated;
    }

    @Override
    public @Nullable Object getCredentials() {
        return accountDetailResult.password();
    }

    @Override
    public @Nullable Object getDetails() {
        return accountDetailResult;
    }

    @Override
    public @Nullable Object getPrincipal() {
        return accountDetailResult.username();
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return accountDetailResult.id();
    }
}
