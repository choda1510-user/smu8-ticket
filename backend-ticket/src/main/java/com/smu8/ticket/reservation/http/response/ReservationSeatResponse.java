package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.SeatGradeResponse;
import com.smu8.ticket.concert.http.response.SeatResponse;
import lombok.Builder;

@Builder
public record ReservationSeatResponse(
        Long id,
        SeatGradeResponse seatGrade,
        SeatResponse seat
) {
}
