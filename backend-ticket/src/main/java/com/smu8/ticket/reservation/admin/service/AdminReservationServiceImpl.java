package com.smu8.ticket.reservation.admin.service;

import com.smu8.ticket.reservation.admin.dto.command.CancelReservationCommand;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationDetailResult;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationListResult;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminReservationListResult> getReservations(){
        return reservationRepository.findAll().stream()
                .map(AdminReservationListResult::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReservationDetailResult getReservation(Long reservationId){
        Reservation reservation = getById(reservationId);
        return AdminReservationDetailResult.from(reservation);
    }

    @Override
    @Transactional
    public AdminReservationDetailResult cancelReservation(CancelReservationCommand command){
            Reservation reservation = getById(command.reservationId());
            reservation.cancel(command.reason());
            return AdminReservationDetailResult.from(reservation);

    }

    private Reservation getById(Long id){
        return reservationRepository.findById(id).orElseThrow();
    }
}
