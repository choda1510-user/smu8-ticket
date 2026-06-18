package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.HashSet;

public class AccountAuthentication extends AbstractAuthenticationToken {
    private final AccountDetailResult accountDetailResult;
    private boolean authenticated;

    public AccountAuthentication(AccountDetailResult accountDetailResult, boolean authenticated) {
        // super(accountData.authorities() != null ? accountData.authorities().stream().map(SimpleGrantedAuthority::new).toList() : new HashSet<>());
        super(new HashSet<>());
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
