package com.smu8.ticket.reservation.dto.command;

import lombok.Builder;

@Builder
public record CreatePreemptReservationSeatCommand(
        String seatId,
        String accountId
) {
    public static CreatePreemptReservationSeatCommand of(String seatId, String accountId) {
        return CreatePreemptReservationSeatCommand.builder()
                .seatId(seatId)
                .accountId(accountId)
                .build();
    }
}
