package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
// 관리자 공연 목록에서 검색 조건과 예매 상태 조건을 DB 쿼리로 조합하기 위해 Specification 실행 기능을 추가합니다.
public interface ConcertRepository extends JpaRepository<Concert, Long>, JpaSpecificationExecutor<Concert> {
    Page<Concert> findAll(Pageable pageable);

    @Query("""
            select distinct concert
            from Concert concert
            where concert.performanceStatus <> :canceledStatus
            """)
    Page<Concert> findActiveConcerts(
            @Param("canceledStatus") String canceledStatus,
            Pageable pageable
    );

    @Query("""
            select distinct concert
            from Concert concert
            join concert.performanceSchedules schedule
            where concert.performanceStatus <> :canceledStatus
              and schedule.reservationStartAt > :now
            """)
    Page<Concert> findUpcomingConcerts(
            @Param("canceledStatus") String canceledStatus,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    @Query("""
            select distinct concert
            from Concert concert
            join concert.performanceSchedules schedule
            where concert.performanceStatus <> :canceledStatus
              and schedule.reservationStartAt <= :now
              and schedule.reservationEndAt >= :now
            """)
    Page<Concert> findOpenConcerts(
            @Param("canceledStatus") String canceledStatus,
            @Param("now") LocalDateTime now,
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
