package com.smu8.ticket.reservation.admin.service;

import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.reservation.admin.dto.command.CreateCancelReservationCommand;
import com.smu8.ticket.reservation.admin.dto.query.AdminReservationQuery;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationDetailResult;
import com.smu8.ticket.reservation.admin.dto.result.AdminReservationItemResult;

public interface AdminReservationService {

    PageResult<AdminReservationItemResult> getReservations(AdminReservationQuery query);

    AdminReservationDetailResult getReservation(Long reservationId);

    AdminReservationDetailResult cancelReservation(CreateCancelReservationCommand command);
}
