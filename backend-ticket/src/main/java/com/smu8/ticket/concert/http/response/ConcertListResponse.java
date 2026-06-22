package com.smu8.ticket.concert.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import lombok.Builder;

import java.util.List;

@Builder
public record ConcertListResponse(
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
