package com.smu8.ticket.reservation.repository;

public interface PreemptReservationSeatRepository {
    void createPreempt(String seatId, String accountId);
    void removePreempt(String seatId);
    boolean existsPreempt(String seatId);
    String findOwnPreemptAccountId(String seatId);
}
