package com.smu8.ticket.account.http.request;

public record CreateAccountRequest(
        String username,
        String password,
        String nickname
) {
}
