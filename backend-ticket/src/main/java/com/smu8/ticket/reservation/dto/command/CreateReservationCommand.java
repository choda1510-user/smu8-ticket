package com.smu8.ticket.reservation.dto.command;

import com.smu8.ticket.reservation.http.request.CreateReservationRequest;
import lombok.Builder;

import java.util.List;

@Builder
public record CreateReservationCommand(
        String accountId,
        Long concertId,
        Long scheduleId,
        List<Long> seatIds
) {
    public static CreateReservationCommand from(String accountId, CreateReservationRequest request) {
        if (request == null) {
            return CreateReservationCommand.builder()
                    .accountId(accountId)
                    .build();
        }

        return CreateReservationCommand.builder()
                .accountId(accountId)
                .concertId(request.concertId())
                .scheduleId(request.scheduleId())
                .seatIds(request.seatIds())
                .build();
    }
}
