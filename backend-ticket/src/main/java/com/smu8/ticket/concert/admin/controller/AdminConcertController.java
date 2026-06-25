package com.smu8.ticket.concert.admin.controller;

import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.concert.admin.http.request.UpdateConcertRequest;
import com.smu8.ticket.concert.admin.http.response.AdminConcertDetailResponse;
import com.smu8.ticket.concert.admin.service.ConcertService;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.http.response.ConcertItemResponse;
import com.smu8.ticket.http.response.PageInfoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AdminConcertController {
    private final ConcertService concertService;

    @Operation(summary = "관리자 공연 등록", description = "관리자가 새로운 공연을 등록합니다.")
    @PostMapping("/api/admin/concerts")
    public ResponseEntity<AdminConcertDetailResponse> createConcert(
            @RequestPart(value = "cardPoster")
            MultipartFile cardPoster,
            @RequestPart(value = "bannerPoster")
            MultipartFile bannerPoster,
            @RequestPart(value = "descriptionPoster")
            MultipartFile descriptionPoster,
            @RequestPart(value = "request")
            CreateConcertRequest createConcertRequest
    ) {
        ConcertDetailResult result = concertService.createConcert(CreateConcertCommand.from(createConcertRequest));
        return ResponseEntity
                .created(URI.create("/api/admin/concerts/" + result.id()))
                .body(AdminConcertDetailResponse.from(result));
    }

    @Operation(summary = "관리자 공연 목록 조회", description = "관리자가 등록된 공연 목록을 조회합니다.")
    @GetMapping("/api/admin/concerts")
    public ResponseEntity<PageInfoResponse<ConcertItemResponse>> getConcerts(
            @RequestParam(name = "concertNames", required = false) String concertNames,
            @RequestParam(name = "page", defaultValue = "0", required = false) Integer page,
            @RequestParam(name = "size", defaultValue = "4", required = false) Integer size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "venueCode", required = false) String venueCode,
            @RequestParam(name = "venueNames", required = false) String venueNames
    ) {
        return ResponseEntity.ok(PageInfoResponse.from(concertService.getConcerts(ConcertPageQuery.builder().build()), ConcertItemResponse::from));
    }

    @Operation(summary = "관리자 공연 상세 조회", description = "관리자가 공연 고유 ID로 공연 상세 정보를 조회합니다.")
    @GetMapping("/api/admin/concerts/{id}")
    public ResponseEntity<AdminConcertDetailResponse> getConcert(
            @Parameter(description = "조회할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(AdminConcertDetailResponse.from(concertService.getConcert(ConcertDetailQuery.builder().id(id).build())));
    }

    @Operation(summary = "관리자 공연 수정", description = "관리자가 공연 정보를 수정합니다.")
    @PostMapping("/api/admin/concerts/{id}")
    public ResponseEntity<AdminConcertDetailResponse> updateConcert(
            @Parameter(description = "수정할 공연 고유 ID", example = "1")
            @PathVariable Long id,
            @RequestPart(value = "cardPoster")
            MultipartFile cardPoster,
            @RequestPart(value = "bannerPoster")
            MultipartFile bannerPoster,
            @RequestPart(value = "descriptionPoster")
            MultipartFile descriptionPoster,
            @RequestPart(value = "request")
            UpdateConcertRequest updateConcertRequest
    ) {
        ConcertDetailResult result = concertService.updateConcert(UpdateConcertCommand.from(id, updateConcertRequest));
        return ResponseEntity.ok(AdminConcertDetailResponse.from(result));
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
