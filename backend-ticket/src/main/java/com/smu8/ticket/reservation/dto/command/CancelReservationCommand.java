package com.smu8.ticket.reservation.dto.command;

import com.smu8.ticket.reservation.admin.http.request.CancelReservationRequest;
import com.smu8.ticket.reservation.entity.CancelReservation;
import lombok.Builder;

@Builder
public record CancelReservationCommand (
        Long reservationId,
        String reason
) {
    public static CancelReservationCommand from(Long reservationId, CancelReservationRequest request){
            return CancelReservationCommand.builder()
                    .reservationId(reservationId)
                    .reason(request.reason())
                    .build();
    }
}
