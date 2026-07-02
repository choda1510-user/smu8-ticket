package com.smu8.waiting.repository;

import com.smu8.waiting.entity.ConcertReservationTime;

import java.util.List;
import java.util.Optional;

public interface ConcertReservationTimeRepository {
    Optional<ConcertReservationTime> findByConcertId(String concertId);

    ConcertReservationTime save(ConcertReservationTime concertReservationTime);

    boolean existsByConcertId(String concertId);

    List<ConcertReservationTime> findAll();

    void deleteByConcertId(String concertId);
}
