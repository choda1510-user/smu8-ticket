package com.smu8.waiting.http.request;

import com.smu8.waiting.dto.command.EnterWaitingQueueCommand;

public record EnterWaitingQueueRequest(
        String accountId
) {
    public EnterWaitingQueueCommand toCommand(String concertId) {
        return new EnterWaitingQueueCommand(concertId, accountId);
    }
}
