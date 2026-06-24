package com.smu8.ticket.reservation.http.request;

import java.util.List;

public record CreateReservationRequest (
            Long memberId,
            Long scheduleId,
            List<Long> seatIds
){
}
