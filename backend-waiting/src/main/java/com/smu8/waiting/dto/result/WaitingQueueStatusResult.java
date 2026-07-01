package com.smu8.waiting.dto.result;

/**
 * 사용자의 현재 대기열 상태와 예매 가능 여부를 나타냅니다.
 */
public record WaitingQueueStatusResult(
        // 상태를 조회한 공연 식별값입니다.
        String concertId,
        // 상태를 조회한 사용자 식별값입니다.
        String accountId,
        // 사용자가 대기열을 통과해 예매 가능한 상태인지 여부입니다.
        boolean active,
        // 사용자가 아직 대기열에 남아 있는지 여부입니다.
        boolean waiting,
        // 사용자의 현재 대기 순번입니다. 대기열에 없으면 null일 수 있습니다.
        Long rank,
        // 해당 공연의 현재 전체 대기 인원 수입니다.
        long waitingCount,
        // 현재 시간이 공연의 예매 가능 시간 안에 있는지 여부입니다.
        boolean reservationOpen
) {
}
