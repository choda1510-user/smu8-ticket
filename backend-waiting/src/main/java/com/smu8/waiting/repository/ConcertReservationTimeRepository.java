package com.smu8.waiting.repository;

import com.smu8.waiting.entity.ConcertReservationTime;

import java.util.Optional;

public interface ConcertReservationTimeRepository {
    Optional<ConcertReservationTime> findByConcertId(String concertId);

    ConcertReservationTime save(ConcertReservationTime concertReservationTime);

    boolean existsByConcertId(String concertId);

    void deleteByConcertId(String concertId);
}
