package com.smu8.ticket.auth.dto.query;

import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Builder
public record TokenQuery(
        String userId,
        Collection<? extends GrantedAuthority> authorities
) {
}
