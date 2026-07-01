package com.smu8.waiting.dto.command;

/**
 * 대기열을 통과한 사용자의 예매 가능 상태를 제거할 때 사용하는 명령입니다.
 */
public record RemoveActiveAccountCommand(
        // 예매 가능 상태를 제거할 공연 식별값입니다.
        String concertId,
        // 예매 가능 상태를 제거할 사용자 식별값입니다.
        String accountId
) {
}
