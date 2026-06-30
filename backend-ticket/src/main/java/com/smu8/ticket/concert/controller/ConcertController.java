package com.smu8.ticket.concert.controller;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.dto.query.PageQuery;
import com.smu8.ticket.concert.http.response.ConcertDetailResponse;
import com.smu8.ticket.concert.http.response.ConcertItemResponse;
import com.smu8.ticket.concert.service.ConcertService;
import com.smu8.ticket.http.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ConcertController {
    private final ConcertService concertService;

    @Operation(summary = "공연 목록 조회", description = "사용자에게 공개된 공연 목록을 조회합니다.")
    @GetMapping("/api/concerts")
    public ResponseEntity<PageResponse<ConcertItemResponse>> getConcerts(
            @RequestParam(name = "concertNames", required = false)
            String concertNames,
            @RequestParam(name = "page", defaultValue = "0", required = false)
            Integer page,
            @RequestParam(name = "size", defaultValue = "4", required = false)
            Integer size,
            @RequestParam(name = "status", required = false)
            String status,
            @RequestParam(name = "venueCode", required = false)
            String venueCode,
            @RequestParam(name = "venueNames", required = false)
            String venueNames
    ) {
        return ResponseEntity.ok(PageResponse.from(
                concertService.getConcerts(ConcertPageQuery.builder()
                        .pageQuery(PageQuery.of(page, size))
                        .concertNames(concertNames == null ? List.of() : List.of(concertNames))
                        .status(status)
                        .venueCode(venueCode)
                        .venueNames(venueNames)
                        .build()),
                ConcertItemResponse::from
        ));
    }

    @Operation(summary = "공연 상세 조회", description = "공연 고유 ID로 공연 상세 정보를 조회합니다.")
    @GetMapping("/api/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> getConcert(
            @Parameter(description = "조회할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ConcertDetailResponse.from(concertService.getConcert(ConcertDetailQuery.builder()
                .id(id)
                .build())));
    }
}
