package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ConcertRepository extends JpaRepository<Concert, Long> {
    Page<Concert> findAll(Pageable pageable);

    Page<Concert> findDistinctByPerformanceSchedulesReservationStartAtAfter(
            LocalDateTime reservationStartAt,
            Pageable pageable
    );

    Page<Concert> findDistinctByPerformanceSchedulesReservationStartAtLessThanEqual(
            LocalDateTime reservationStartAt,
            Pageable pageable
    );
}
