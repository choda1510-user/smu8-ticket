package com.smu8.waiting.http.response;

import com.smu8.waiting.dto.result.WaitingQueueEntryResult;

public record WaitingQueueEntryResponse(
        String concertId,
        String accountId,
        boolean entered,
        boolean active,
        Long rank,
        long waitingCount
) {
    public static WaitingQueueEntryResponse from(WaitingQueueEntryResult result) {
        return new WaitingQueueEntryResponse(
                result.concertId(),
                result.accountId(),
                result.entered(),
                result.active(),
                result.rank(),
                result.waitingCount()
        );
    }
}
