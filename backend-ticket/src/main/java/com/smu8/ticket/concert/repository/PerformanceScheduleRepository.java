package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.PerformanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PerformanceScheduleRepository extends JpaRepository<PerformanceSchedule, Long> {
    // 같은 공연장에 동일한 공연시작일시를 가진 회차가 이미 존재하는지 확인
    boolean existsByConcert_Venue_IdAndShowStartAt(Long venueId, LocalDateTime showStartAt);
}
