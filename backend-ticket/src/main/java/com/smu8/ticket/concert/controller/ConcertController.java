package com.smu8.ticket.concert.controller;

import com.smu8.ticket.concert.http.response.ConcertDetailResponse;
import com.smu8.ticket.concert.http.response.ConcertListResponse;
import com.smu8.ticket.concert.service.ConcertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class ConcertController {
    private final ConcertService concertService;

    @GetMapping("/api/concerts")
    public ResponseEntity<ConcertListResponse> getConcerts() {
        return ResponseEntity.ok(ConcertListResponse.from(concertService.getConcerts()));
    }

    @GetMapping("/api/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> getConcert(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ConcertDetailResponse.from(concertService.getConcert(id)));
    }
}
