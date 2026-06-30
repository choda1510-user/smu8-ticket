package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            select concert
            from Concert concert
            join concert.venue venue
            where (:concertName is null
                    or lower(concert.title) like lower(concat('%', :concertName, '%')))
              and (:concertCode is null
                    or lower(concert.performanceCode) like lower(concat('%', :concertCode, '%')))
              and (:venueName is null
                    or lower(venue.name) like lower(concat('%', :venueName, '%')))
              and (:venueId is null or venue.id = :venueId)
              and (:status is null
                    or lower(concert.performanceStatus) = lower(:status))
            """)
    Page<Concert> search(
            @Param("concertName") String concertName,
            @Param("concertCode") String concertCode,
            @Param("venueName") String venueName,
            @Param("venueId") Long venueId,
            @Param("status") String status,
            Pageable pageable
    );
}
