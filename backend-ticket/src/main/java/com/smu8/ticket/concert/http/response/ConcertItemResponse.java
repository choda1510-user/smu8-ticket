package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ConcertItemResponse(
        @Schema(description = "화면에서 사용하는 공연 ID")
        Long concertId,
        @Schema(description = "공연 포스터 이미지 주소")
        String cardPosterUrl,
        @Schema(description = "공연 배너 이미지 주소")
        String bannerPosterUrl,
        @Schema(description = "공연 제목")
        String title,
        @Schema(description = "공연 날짜들")
        List<ConcertScheduleResponse> dates,
        @Schema(description = "예매 오픈 시작일시")
        LocalDateTime reservationStartAt,
        @Schema(description = "공연장 고유 ID")
        Long venueId,
        @Schema(description = "공연장 이름")
        String venueName
) {
    public static ConcertItemResponse from(ConcertDetailResult result) {
        return null;
    }
}
