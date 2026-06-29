package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.CancelReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CancelReservationRepository extends JpaRepository<CancelReservation, Long> {
}
