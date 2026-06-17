package com.smu8.ticket.authentication;

import com.smu8.ticket.account.dto.AccountData;
import com.smu8.ticket.account.service.AccountAuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.oauth2.jwt.Jwt;

@RequiredArgsConstructor
public class AccountAuthenticationConvertor implements Converter<Jwt, AccountAuthentication> {
    private final AccountAuthenticationService accountService;
    @Override
    public AccountAuthentication convert(Jwt source) {
        AccountData account = accountService.getById(source.getSubject());
        return new AccountAuthentication(
                account,
                true
        );
    }
}
