package com.smu8.ticket.account.http.request;

public record UpdateAccountRequest(
        String nickname,
        String password
) {
}
