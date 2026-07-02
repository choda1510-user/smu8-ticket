package com.smu8.waiting.http.response;

import com.smu8.waiting.dto.result.WaitingQueueStatusResult;

public record WaitingQueueStatusResponse(
        String concertId,
        String accountId,
        boolean active,
        boolean waiting,
        Long rank,
        long waitingCount,
        boolean reservationOpen
) {
    public static WaitingQueueStatusResponse from(WaitingQueueStatusResult result) {
        return new WaitingQueueStatusResponse(
                result.concertId(),
                result.accountId(),
                result.active(),
                result.waiting(),
                result.rank(),
                result.waitingCount(),
                result.reservationOpen()
        );
    }
}
