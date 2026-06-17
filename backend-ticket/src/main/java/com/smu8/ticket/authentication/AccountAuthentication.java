package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.AccountData;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.HashSet;

public class AccountAuthentication extends AbstractAuthenticationToken {
    private final AccountData accountData;
    private boolean authenticated;

    public AccountAuthentication(AccountData accountData, boolean authenticated) {
        // super(accountData.authorities() != null ? accountData.authorities().stream().map(SimpleGrantedAuthority::new).toList() : new HashSet<>());
        super(new HashSet<>());
        this.accountData = accountData;
        this.authenticated = authenticated;
    }

    @Override
    public @Nullable Object getCredentials() {
        return accountData.password();
    }

    @Override
    public @Nullable Object getDetails() {
        return accountData;
    }

    @Override
    public @Nullable Object getPrincipal() {
        return accountData.username();
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
        return accountData.id();
    }
}
