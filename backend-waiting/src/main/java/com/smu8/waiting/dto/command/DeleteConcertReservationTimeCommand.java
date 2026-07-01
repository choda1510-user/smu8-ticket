package com.smu8.waiting.dto.command;

/**
 * 공연별 예매 가능 시간 정보를 삭제할 때 사용하는 명령입니다.
 */
public record DeleteConcertReservationTimeCommand(
        // 삭제할 예매 시간 정보의 공연 식별값입니다.
        String concertId
) {
}
