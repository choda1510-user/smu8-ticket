package com.smu8.waiting.dto.query;

import lombok.Builder;

/**
 * 사용자의 공연 대기열 상태를 조회할 때 사용하는 요청입니다.
 */
@Builder
public record WaitingQueueStatusQuery(
        // 대기열 상태를 조회할 공연 식별값입니다.
        String concertId,
        // 대기열 상태를 조회할 사용자 식별값입니다.
        String accountId
) {
    public static WaitingQueueStatusQuery from(String concertId, String accountId) {
        return WaitingQueueStatusQuery.builder()
                .concertId(concertId)
                .accountId(accountId)
                .build();
    }
}
