package com.smu8.ticket.account.dto.command;

import lombok.Builder;

@Builder
public record AdminAccountCommand(
        String username
) {
}
