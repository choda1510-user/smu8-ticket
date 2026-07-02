package com.smu8.waiting.http.response;

import com.smu8.waiting.dto.result.ActiveAccountResult;

public record ActiveAccountResponse(
        String concertId,
        String accountId,
        boolean active
) {
    public static ActiveAccountResponse from(ActiveAccountResult result) {
        return new ActiveAccountResponse(
                result.concertId(),
                result.accountId(),
                result.active()
        );
    }
}
