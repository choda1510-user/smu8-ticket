package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findAll(Pageable pageable);
    Page<Reservation> findByAccountId(String accountId, Pageable pageable);
    Optional<Reservation> findByReservationIdAndAccountId(Long reservationId, String accountId);

    // 기존 Reservation.totalQuantity를 합산해 DB 컬럼 추가 없이 회차별 예매 좌석 수를 계산합니다.
    @Query("""
            select coalesce(sum(r.totalQuantity), 0)
            from Reservation r
            where r.account.id = :accountId
              and r.performanceSchedule.id = :scheduleId
              and r.reservationStatus = :reservationStatus
            """)
    Long sumTotalQuantityByAccountIdAndScheduleIdAndReservationStatus(
            @Param("accountId") String accountId,
            @Param("scheduleId") Long scheduleId,
            @Param("reservationStatus") String reservationStatus
    );
}
