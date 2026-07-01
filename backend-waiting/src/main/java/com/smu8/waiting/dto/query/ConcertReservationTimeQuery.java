package com.smu8.waiting.dto.query;

/**
 * 공연별 예매 가능 시간 정보를 조회할 때 사용하는 요청입니다.
 */
public record ConcertReservationTimeQuery(
        // 조회할 예매 시간 정보의 공연 식별값입니다.
        String concertId
) {
}
