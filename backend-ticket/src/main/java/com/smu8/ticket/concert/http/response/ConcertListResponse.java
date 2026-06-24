package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Builder
public record ConcertListResponse(
        @Schema(description = "공연 목록")
        List<ConcertDetailResponse> concerts
) {
    public static ConcertListResponse from(List<ConcertDetailResult> results) {
        return ConcertListResponse.builder()
                .concerts(results.stream()
                        .map(ConcertDetailResponse::from)
                        .toList())
                .build();
    }
}
