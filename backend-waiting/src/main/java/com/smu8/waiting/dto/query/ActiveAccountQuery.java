package com.smu8.waiting.dto.query;

import lombok.Builder;

/**
 * 사용자가 대기열을 통과해 예매 가능한 상태인지 조회할 때 사용하는 요청입니다.
 */
@Builder
public record ActiveAccountQuery(
        // 예매 가능 상태를 조회할 공연 식별값입니다.
        String concertId,
        // 예매 가능 상태를 조회할 사용자 식별값입니다.
        String accountId
) {
    public static ActiveAccountQuery from(String concertId, String accountId) {
        return ActiveAccountQuery.builder()
                .concertId(concertId)
                .accountId(accountId)
                .build();
    }
}
