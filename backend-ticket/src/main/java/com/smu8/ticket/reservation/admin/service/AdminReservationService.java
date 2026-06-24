package com.smu8.ticket.reservation.admin.service;

import com.smu8.ticket.reservation.admin.dto.command.CancelReservationCommand;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationDetailResult;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationListResult;
import com.smu8.ticket.reservation.entity.CancelReservation;

import java.util.List;

public interface AdminReservationService {

    List<AdminReservationListResult> getReservations();

    AdminReservationDetailResult getReservation(Long reservationId);

    AdminReservationDetailResult cancelReservation(CancelReservationCommand command);
}
