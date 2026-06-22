package com.smu8.ticket.account.dto.command;

import com.smu8.ticket.account.http.request.AdminAccountRequest;
import lombok.Builder;

@Builder
public record AdminAccountCommand(
        String username
) {
    public static AdminAccountCommand from(AdminAccountRequest request) {
        return AdminAccountCommand.builder()
                .username(request.username())
                .build();
    }
}
