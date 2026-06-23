package com.smu8.ticket.concert.admin.controller;

import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.concert.admin.http.request.UpdateConcertRequest;
import com.smu8.ticket.concert.admin.http.response.ConcertDetailResponse;
import com.smu8.ticket.concert.admin.http.response.ConcertListResponse;
import com.smu8.ticket.concert.admin.service.ConcertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @Operation(summary = "관리자 공연 등록", description = "관리자가 새로운 공연을 등록합니다.")
    @PostMapping("/api/admin/concerts")
    public ResponseEntity<ConcertDetailResponse> createConcert(
            @RequestBody CreateConcertRequest createConcertRequest
    ) {
        ConcertDetailResult result = concertService.createConcert(CreateConcertCommand.from(createConcertRequest));
        return ResponseEntity
                .created(URI.create("/api/admin/concerts/" + result.id()))
                .body(ConcertDetailResponse.from(result));
    }

    @Operation(summary = "관리자 공연 목록 조회", description = "관리자가 등록된 공연 목록을 조회합니다.")
    @GetMapping("/api/admin/concerts")
    public ResponseEntity<ConcertListResponse> getConcerts() {
        return ResponseEntity.ok(ConcertListResponse.from(concertService.getConcerts()));
    }

    @Operation(summary = "관리자 공연 상세 조회", description = "관리자가 공연 고유 ID로 공연 상세 정보를 조회합니다.")
    @GetMapping("/api/admin/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> getConcert(
            @Parameter(description = "조회할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ConcertDetailResponse.from(concertService.getConcert(id)));
    }

    @Operation(summary = "관리자 공연 수정", description = "관리자가 공연 정보를 수정합니다.")
    @PatchMapping("/api/admin/concerts/{id}")
    public ResponseEntity<ConcertDetailResponse> updateConcert(
            @Parameter(description = "수정할 공연 고유 ID", example = "1")
            @PathVariable Long id,
            @RequestBody UpdateConcertRequest updateConcertRequest
    ) {
        ConcertDetailResult result = concertService.updateConcert(UpdateConcertCommand.from(id, updateConcertRequest));
        return ResponseEntity.ok(ConcertDetailResponse.from(result));
    }

    @Operation(summary = "관리자 공연 삭제", description = "관리자가 공연을 삭제합니다.")
    @DeleteMapping("/api/admin/concerts/{id}")
    public ResponseEntity<Void> deleteConcert(
            @Parameter(description = "삭제할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        concertService.deleteConcert(id);
        return ResponseEntity.noContent().build();
    }
}
