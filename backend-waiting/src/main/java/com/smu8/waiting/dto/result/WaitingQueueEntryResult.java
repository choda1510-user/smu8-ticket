package com.smu8.waiting.dto.result;

/**
 * 사용자의 대기열 진입 처리 결과를 나타냅니다.
 */
public record WaitingQueueEntryResult(
        // 대기열 진입을 시도한 공연 식별값입니다.
        String concertId,
        // 대기열 진입을 시도한 사용자 식별값입니다.
        String accountId,
        // 이번 요청으로 새로 대기열에 등록되었는지 여부입니다.
        boolean entered,
        // 이미 대기열을 통과해 예매 가능한 상태인지 여부입니다.
        boolean active,
        // 사용자의 현재 대기 순번입니다. 예매 가능 상태이면 null일 수 있습니다.
        Long rank,
        // 해당 공연의 현재 전체 대기 인원 수입니다.
        long waitingCount
) {
}
