package com.smu8.ticket.reservation.dto.command;

import com.smu8.ticket.reservation.http.request.PreemptReservationSeatRequest;
import lombok.Builder;

import java.util.List;

@Builder
// 선점 생성 요청과 같은 입력을 서비스 계층에서 쓰기 쉬운 명령 객체로 바꾼다.
public record RemovePreemptReservationSeatCommand(
        String accountId,
        Long concertId,
        Long scheduleId,
        List<Long> seatIds
) {
    public static RemovePreemptReservationSeatCommand from(String accountId, PreemptReservationSeatRequest request) {
        if (request == null) {
            return RemovePreemptReservationSeatCommand.builder()
                    .accountId(accountId)
                    .build();
        }

        return RemovePreemptReservationSeatCommand.builder()
                .accountId(accountId)
                .concertId(request.concertId())
                .scheduleId(request.scheduleId())
                .seatIds(request.seatIds())
                .build();
    }
}
