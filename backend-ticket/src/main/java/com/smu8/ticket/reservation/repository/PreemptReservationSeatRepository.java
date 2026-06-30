package com.smu8.ticket.reservation.repository;

public interface PreemptReservationSeatRepository {
    // 이미 있는 선점 좌석을 등록하려고 할 때 예외를 던져야 함.
    void createPreempt(String seatId, String accountId) throws IllegalStateException;
    // 다른 사용자의 선점을 실수로 지우지 않기 위해 소유자 확인 후 해제한다.
    void removeOwnPreempt(String seatId, String accountId);
    void removePreempt(String seatId);
    boolean existsPreempt(String seatId);
    String findOwnPreemptAccountId(String seatId);
}
