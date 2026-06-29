package com.smu8.ticket.reservation.repository;

import com.smu8.ticket.reservation.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findAll(Pageable pageable);
    Page<Reservation> findByAccountId(String accountId, Pageable pageable);
    Optional<Reservation> findByReservationIdAndAccountId(Long reservationId, String accountId);
}
