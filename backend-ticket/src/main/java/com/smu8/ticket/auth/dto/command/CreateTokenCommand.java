package com.smu8.ticket.auth.dto.command;

import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Builder
public record CreateTokenCommand(
        String userId,
        Collection<? extends GrantedAuthority> authorities
) {
}
