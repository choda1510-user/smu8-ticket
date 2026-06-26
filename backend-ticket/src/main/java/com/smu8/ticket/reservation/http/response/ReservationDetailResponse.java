package com.smu8.ticket.reservation.http.response;

import com.smu8.ticket.concert.http.response.ConcertScheduleResponse;
import com.smu8.ticket.concert.http.response.SeatGradeResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReservationDetailResponse(
        @Schema(description = "예매 고유 Id")
        Long reservationId,
        @Schema(description = "예매한 공연 회차")
        ConcertScheduleResponse reservedSchedule,
        @Schema(description = "예매번호")
        String reservationNo,
        @Schema(description = "예매자 고유 Id")
        String accountId,
        @Schema(description = "예매 상태")
        String reservationStatus,
        @Schema(description = "예매한 좌석 총합 수")
        Integer totalQuantity,
        @Schema(description = "예매 총합 금액")
        Integer totalAmount,
        @Schema(description = "예매 날짜")
        LocalDateTime reservedAt,
        @Schema(description = "공연 제목")
        String concertTitle,
        @Schema(description = "공연 카드 이미지 주소")
        String cardPosterUrl,
        @Schema(description = "좌석 타입 목록")
        List<SeatGradeResponse> seatGrades,
        @Schema(description = "예매한 공연 회차 전체 목록")
        List<ConcertScheduleResponse> concertSchedules,
        @Schema(description = "공연장 고유 Id")
        Long venueId,
        @Schema(description = "공연장 이름")
        String venueName,
        @Schema(description = "예매한 좌석 목록")
        List<ReservationSeatResponse> seats
) {
}
