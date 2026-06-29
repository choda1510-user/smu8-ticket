package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.ReservationSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationSeatRepository extends JpaRepository<ReservationSeat, Long> {
    boolean existsBySeatIdIn(Collection<Long> seatIds);
    List<ReservationSeat> findByReservationReservationId(Long reservationId);
    void deleteByReservationReservationId(Long reservationId);
}
