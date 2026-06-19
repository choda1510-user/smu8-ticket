package com.smu8.ticket.account.dto.command;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.http.request.CreateAccountRequest;
import lombok.Builder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Builder
public record CreateAccountCommand(
        String username,
        String password,
        String nickname
) {
    public static CreateAccountCommand from(CreateAccountRequest request) {
        return CreateAccountCommand.builder()
                .username(request.username())
                .password(request.password())
                .nickname(request.nickname())
                .build();
    }
    public Account byId(String id, PasswordEncoder passwordEncoder) {
        return Account.builder()
                .id(id)
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build();
    }
}
