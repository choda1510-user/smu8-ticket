package com.smu8.waiting.dto.command;

import java.time.LocalDateTime;

/**
 * 공연별 예매 가능 시간을 저장하거나 갱신할 때 사용하는 명령입니다.
 */
public record SaveConcertReservationTimeCommand(
        // 대기열과 예매 시간을 구분하는 공연 식별값입니다.
        String concertId,
        // 사용자가 예매를 시작할 수 있는 시간입니다.
        LocalDateTime reservationStartDate,
        // 사용자가 예매를 시도할 수 있는 마지막 종료 시간입니다.
        LocalDateTime reservationLastEndDate
) {
}
