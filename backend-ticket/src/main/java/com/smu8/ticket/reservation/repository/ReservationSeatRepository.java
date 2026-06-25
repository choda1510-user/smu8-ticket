package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.ReservationSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationSeatRepository extends JpaRepository<ReservationSeat, Long> {
}
