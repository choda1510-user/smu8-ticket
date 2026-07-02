package com.smu8.ticket.waiting.authentication;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

public class WaitingActiveAccountAuthentication extends AbstractAuthenticationToken {
    private final String concertId;
    private final String accountId;

    public WaitingActiveAccountAuthentication(String concertId, String accountId) {
        super(AuthorityUtils.NO_AUTHORITIES);
        this.concertId = concertId;
        this.accountId = accountId;
        super.setAuthenticated(false);
    }

    private WaitingActiveAccountAuthentication(String concertId, String accountId, boolean authenticated) {
        super(AuthorityUtils.NO_AUTHORITIES);
        this.concertId = concertId;
        this.accountId = accountId;
        super.setAuthenticated(authenticated);
    }

    public static WaitingActiveAccountAuthentication authenticated(String concertId, String accountId) {
        return new WaitingActiveAccountAuthentication(concertId, accountId, true);
    }

    public String getConcertId() {
        return concertId;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return accountId;
    }

    @Override
    public String getName() {
        return accountId;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException("Use authenticated factory method.");
        }
        super.setAuthenticated(false);
    }
}
