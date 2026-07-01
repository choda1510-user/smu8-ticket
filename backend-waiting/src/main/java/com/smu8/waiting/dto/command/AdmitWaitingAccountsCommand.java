package com.smu8.waiting.dto.command;

import java.time.Duration;

/**
 * 대기열 앞순번 사용자를 예매 가능 상태로 통과시킬 때 사용하는 명령입니다.
 */
public record AdmitWaitingAccountsCommand(
        // 입장 처리를 수행할 공연 식별값입니다.
        String concertId,
        // 대기열에서 통과시킬 사용자 수입니다.
        long count,
        // 통과한 사용자가 예매 가능 상태로 유지되는 시간입니다.
        Duration activeTtl
) {
}
