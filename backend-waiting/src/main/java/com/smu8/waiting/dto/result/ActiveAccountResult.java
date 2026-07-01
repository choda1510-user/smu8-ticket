package com.smu8.waiting.dto.result;

/**
 * 사용자가 대기열을 통과해 예매 가능한 상태인지 나타내는 결과입니다.
 */
public record ActiveAccountResult(
        // 예매 가능 상태를 확인한 공연 식별값입니다.
        String concertId,
        // 예매 가능 상태를 확인한 사용자 식별값입니다.
        String accountId,
        // 사용자가 현재 예매 가능한 상태인지 여부입니다.
        boolean active
) {
}
