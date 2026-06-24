package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
