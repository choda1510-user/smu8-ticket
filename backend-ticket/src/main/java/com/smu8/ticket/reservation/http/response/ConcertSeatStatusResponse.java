package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.SeatResponse;
import com.smu8.ticket.reservation.dto.result.ConcertSeatStatusResult;
import lombok.Builder;

@Builder
public record ConcertSeatStatusResponse(
        SeatResponse seat,
        SeatStatus status
) {
    public static ConcertSeatStatusResponse from(ConcertSeatStatusResult result) {
        return ConcertSeatStatusResponse.builder()
                .seat(SeatResponse.from(result.seat()))
                .status(result.status())
                .build();
    }
}
