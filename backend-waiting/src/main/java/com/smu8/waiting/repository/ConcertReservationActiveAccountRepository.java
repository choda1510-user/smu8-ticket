package com.smu8.waiting.repository;

import java.time.Duration;

public interface ConcertReservationActiveAccountRepository {
    void add(String concertId, String accountId, Duration ttl);

    boolean contains(String concertId, String accountId);

    void remove(String concertId, String accountId);

    long count(String concertId);

    void deleteByConcertId(String concertId);
}
