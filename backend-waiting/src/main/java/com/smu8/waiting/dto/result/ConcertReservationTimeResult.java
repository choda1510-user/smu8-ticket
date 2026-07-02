package com.smu8.waiting.dto.result;

import com.smu8.waiting.entity.ConcertReservationTime;

import java.time.LocalDateTime;

/**
 * 공연별 예매 가능 시간 정보를 서비스 밖으로 전달하는 결과입니다.
 */
public record ConcertReservationTimeResult(
        // 예매 시간 정보가 속한 공연 식별값입니다.
        String concertId,
        // 사용자가 예매를 시작할 수 있는 시간입니다.
        LocalDateTime reservationStartDate,
        // 사용자가 예매를 시도할 수 있는 마지막 종료 시간입니다.
        LocalDateTime reservationLastEndDate
) {
    public static ConcertReservationTimeResult from(ConcertReservationTime concertReservationTime) {
        return new ConcertReservationTimeResult(
                concertReservationTime.getConcertId(),
                concertReservationTime.getReservationStartDate(),
                concertReservationTime.getReservationLastEndDate()
        );
    }
}
