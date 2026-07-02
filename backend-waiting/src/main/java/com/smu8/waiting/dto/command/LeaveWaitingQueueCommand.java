package com.smu8.waiting.dto.command;

import lombok.Builder;

/**
 * 사용자를 특정 공연의 대기열에서 제거할 때 사용하는 명령입니다.
 */
@Builder
public record LeaveWaitingQueueCommand(
        // 대기열에서 제거할 공연 식별값입니다.
        String concertId,
        // 대기열에서 제거할 사용자 식별값입니다.
        String accountId
) {
    public static LeaveWaitingQueueCommand from(String concertId, String accountId) {
        return LeaveWaitingQueueCommand.builder()
                .concertId(concertId)
                .accountId(accountId)
                .build();
    }
}
