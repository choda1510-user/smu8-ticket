package com.smu8.ticket.concert.admin.controller;

import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.concert.admin.http.request.UpdateConcertRequest;
import com.smu8.ticket.concert.admin.http.response.ConcertDetailResponse;
import com.smu8.ticket.concert.admin.http.response.ConcertListResponse;
import com.smu8.ticket.concert.admin.service.ConcertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AdminConcertController {
    private final ConcertService concertService;

    @PostMapping("/api/admin/concerts")
    public ResponseEntity<ConcertDetailResponse> createConcert(
            @RequestBody CreateConcertRequest createConcertRequest
    ) {
        ConcertDetailResult result = concertService.createConcert(CreateConcertCommand.from(createConcertRequest));
        return ResponseEntity
                .created(URI.create("/api/admin/concerts/" + result.id()))
                .body(ConcertDetailResponse.from(result));
    }

    @GetMapping("/api/admin/concerts")
    public ResponseEntity<ConcertListResponse> getConcerts() {
        return ResponseEntity.ok(ConcertListResponse.from(concertService.getConcerts()));
    }

    @GetMapping("/api/admin/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> getConcert(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ConcertDetailResponse.from(concertService.getConcert(id)));
    }

    @PatchMapping("/api/admin/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> updateConcert(
            @PathVariable Long id,
            @RequestBody UpdateConcertRequest updateConcertRequest
    ) {
        ConcertDetailResult result = concertService.updateConcert(UpdateConcertCommand.from(id, updateConcertRequest));
        return ResponseEntity.ok(ConcertDetailResponse.from(result));
    }

    @DeleteMapping("/api/admin/concerts/{id}")
    public ResponseEntity<Void> deleteConcert(
            @PathVariable Long id
    ) {
        concertService.deleteConcert(id);
        return ResponseEntity.noContent().build();
    }
}
