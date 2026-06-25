package com.smu8.ticket.reservation.admin.dto.command;

import com.smu8.ticket.reservation.admin.http.request.AdminCreateCancelReservationRequest;
import lombok.Builder;

@Builder
public record CreateCancelReservationCommand(
        Long reservationId,
        String reason
) {
    public static CreateCancelReservationCommand from(Long id, AdminCreateCancelReservationRequest request) {
        return null;
    }
}
