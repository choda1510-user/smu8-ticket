package com.smu8.ticket.reservation.service;

import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.reservation.dto.command.CreatePreemptReservationSeatCommand;
import com.smu8.ticket.reservation.dto.command.CreateReservationCommand;
import com.smu8.ticket.reservation.dto.query.ReservationConcertSeatFrameQuery;
import com.smu8.ticket.reservation.dto.query.ReservationPageQuery;
import com.smu8.ticket.reservation.dto.result.ReservationConcertSeatFrameResult;
import com.smu8.ticket.reservation.dto.result.ReservationDetailResult;
import com.smu8.ticket.reservation.dto.result.ReservationItemResult;

public interface ReservationService {
    PageResult<ReservationItemResult> getReservations(ReservationPageQuery query);
    ReservationDetailResult getReservation(Long reservationId, String accountId);
    ReservationConcertSeatFrameResult getReservationSeats(ReservationConcertSeatFrameQuery query);
    void createPreemptReservationSeats(CreatePreemptReservationSeatCommand command);
    ReservationItemResult createReservation(CreateReservationCommand command);
    ReservationItemResult cancelReservation(Long reservationId, String accountId);
}
