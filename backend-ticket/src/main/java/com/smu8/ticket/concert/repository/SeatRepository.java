package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Seat s where s.id in :seatIds")
    List<Seat> findAllByIdInForUpdate(@Param("seatIds") Collection<Long> seatIds);
    List<Seat> findAllByPerformanceScheduleId(Long performanceScheduleId);
}
