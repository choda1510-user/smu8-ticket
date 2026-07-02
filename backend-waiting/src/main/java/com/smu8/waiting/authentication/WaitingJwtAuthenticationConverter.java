package com.smu8.waiting.authentication;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
public class WaitingJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {
    private static final String AUTHORITIES_CLAIM_NAME = "authorities";

    @Override
    public JwtAuthenticationToken convert(Jwt jwt) {
        List<String> authorities = jwt.getClaimAsStringList(AUTHORITIES_CLAIM_NAME);
        Collection<GrantedAuthority> grantedAuthorities = authorities == null
                ? List.of()
                : authorities.stream()
                        .filter((authority) -> authority != null && !authority.isBlank())
                        .map(SimpleGrantedAuthority::new)
                        .map(GrantedAuthority.class::cast)
                        .toList();

        return new JwtAuthenticationToken(jwt, grantedAuthorities, jwt.getSubject());
    }
}
