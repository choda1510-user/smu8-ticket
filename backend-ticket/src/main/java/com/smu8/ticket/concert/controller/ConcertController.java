package com.smu8.ticket.concert.controller;

import com.smu8.ticket.concert.http.response.ConcertDetailResponse;
import com.smu8.ticket.concert.http.response.ConcertListResponse;
import com.smu8.ticket.concert.service.ConcertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ConcertController {
    private final ConcertService concertService;

    @Operation(summary = "공연 목록 조회", description = "사용자에게 공개된 공연 목록을 조회합니다.")
    @GetMapping("/api/concerts")
    public ResponseEntity<ConcertListResponse> getConcerts() {
        return ResponseEntity.ok(ConcertListResponse.from(concertService.getConcerts()));
    }

    @Operation(summary = "공연 상세 조회", description = "공연 고유 ID로 공연 상세 정보를 조회합니다.")
    @GetMapping("/api/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> getConcert(
            @Parameter(description = "조회할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ConcertDetailResponse.from(concertService.getConcert(id)));
    }
}
