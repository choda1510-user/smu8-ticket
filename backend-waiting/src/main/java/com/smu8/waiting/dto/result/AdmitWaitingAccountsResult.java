package com.smu8.waiting.dto.result;

import java.util.List;

/**
 * 대기열에서 통과 처리된 사용자 목록과 남은 대기 인원을 나타냅니다.
 */
public record AdmitWaitingAccountsResult(
        // 입장 처리를 수행한 공연 식별값입니다.
        String concertId,
        // 이번 처리에서 대기열을 통과한 사용자 식별값 목록입니다.
        List<String> accountIds,
        // 입장 처리 후 해당 공연에 남아 있는 대기 인원 수입니다.
        long waitingCount
) {
}
