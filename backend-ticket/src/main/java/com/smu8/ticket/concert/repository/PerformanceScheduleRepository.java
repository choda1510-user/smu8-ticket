package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.PerformanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceScheduleRepository extends JpaRepository<PerformanceSchedule, Long> {
}
