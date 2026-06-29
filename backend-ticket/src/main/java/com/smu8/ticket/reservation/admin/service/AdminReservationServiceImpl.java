package com.smu8.ticket.reservation.admin.service;

import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.reservation.admin.dto.command.CreateCancelReservationCommand;
import com.smu8.ticket.reservation.admin.dto.query.AdminReservationQuery;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationDetailResult;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationItemResult;
import com.smu8.ticket.reservation.entity.CancelReservation;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.repository.CancelReservationRepository;
import com.smu8.ticket.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final ReservationRepository reservationRepository;
    private final CancelReservationRepository cancelReservationRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResult<AdminReservationItemResult> getReservations(AdminReservationQuery query){
        PageRequest pageRequest = PageRequest.of(
                query.pageQuery().page(),
                query.pageQuery().size()
        );

        if (query.accountId() != null && !query.accountId().isBlank()) {
            return PageResult.from(reservationRepository
                    .findByAccountId(query.accountId(), pageRequest)
                    .map(AdminReservationItemResult::from));
        }

        return PageResult.from(reservationRepository
                .findAll(pageRequest)
                .map(AdminReservationItemResult::from));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReservationDetailResult getReservation(Long reservationId){
        Reservation reservation = getById(reservationId);
        return AdminReservationDetailResult.from(reservation);
    }

    @Override
    @Transactional
    public AdminReservationDetailResult cancelReservation(CreateCancelReservationCommand command){
            Reservation reservation = getById(command.reservationId());
            reservation.cancel("CANCELED");
            CancelReservation cancelReservation = cancelReservationRepository.save(CancelReservation.builder()
                    .reservation(reservation)
                    .cancelReason(command.reason())
                    .cancelAmount(0)
                    .cancelStatus("CANCELED")
                    .build());
            
            return AdminReservationDetailResult.from(reservation, cancelReservation);

    }

    private Reservation getById(Long id){
        return reservationRepository.findById(id).orElseThrow();
    }
}
