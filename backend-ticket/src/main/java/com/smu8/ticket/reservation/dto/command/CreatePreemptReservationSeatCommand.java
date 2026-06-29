package com.smu8.ticket.reservation.dto.command;

import com.smu8.ticket.reservation.http.request.PreemptReservationSeatRequest;
import lombok.Builder;

import java.util.List;

@Builder
public record CreatePreemptReservationSeatCommand(
        String accountId,
        Long concertId,
        Long scheduleId,
        List<Long> seatIds
) {
    public static CreatePreemptReservationSeatCommand from(String accountId, PreemptReservationSeatRequest request) {
        if (request == null) {
            return CreatePreemptReservationSeatCommand.builder()
                    .accountId(accountId)
                    .build();
        }

        return CreatePreemptReservationSeatCommand.builder()
                .accountId(accountId)
                .concertId(request.concertId())
                .scheduleId(request.scheduleId())
                .seatIds(request.seatIds())
                .build();
    }
}
