package com.smu8.ticket.authentication;


import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.service.AccountAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class AccountAuthenticationProvider implements AuthenticationProvider {
    private final AccountAuthenticationService accountService;
    private final PasswordEncoder passwordEncoder;
    @Override
    public @Nullable Authentication authenticate(@NonNull Authentication authentication) throws AuthenticationException {
        try {
            if (authentication.getClass().isAssignableFrom(UsernamePasswordAuthenticationToken.class)) {
                AccountDetailResult account = accountService.getByUsername(authentication.getName());
                String rawPassword = (String) authentication.getCredentials();
                boolean isAuthenticated = passwordEncoder.matches(rawPassword, account.password());

                Set<GrantedAuthority> authorities = new HashSet<>();
                authorities.add(new SimpleGrantedAuthority(Authority.BASIC_METHOD.toString()));

                return new AccountAuthentication(
                        account,
                        isAuthenticated,
                        authorities
                );
            } else {
                return null;
            }
        } catch(Exception ex) {
            return null;
        }
    }

    @Override
    public boolean supports(@NonNull Class<?> authentication) {
        return authentication.isAssignableFrom(UsernamePasswordAuthenticationToken.class);
    }
}
