package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.service.AccountAuthenticationService;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
public class AccountAuthenticationConvertor implements Converter<Jwt, AccountAuthentication> {
    private final AccountAuthenticationService accountService;
    private final TokenService tokenService;
    @Override
    public AccountAuthentication convert(Jwt source) {
        if (tokenService.checkAccessToken(TokenQuery.builder().jti(source.getId()).sub(source.getSubject()).build())) {
            throw new AccessDeniedException("Token is expired.");
        }
        AccountDetailResult account = accountService.getById(source.getSubject());
        Set<GrantedAuthority> authorities = new HashSet<>();
        List<String> authorityList = null;
        try {
            authorityList = (List<String>) source.getClaims().get("authorities");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        authorityList.stream().map(SimpleGrantedAuthority::new).forEach(authorities::add);

        return new AccountAuthentication(
                account,
                true,
                authorities
        );
    }
}
