package com.smu8.ticket.reservation.exception;

// 예매 좌석 수 제한 초과를 일반 예외와 구분하기 위한 예약 도메인 예외입니다.
public class ReservationSeatLimitExceededException extends RuntimeException {
    public ReservationSeatLimitExceededException(String message) {
        super(message);
    }
}
