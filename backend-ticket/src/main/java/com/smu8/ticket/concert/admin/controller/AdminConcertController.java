package com.smu8.ticket.concert.admin.controller;

import com.smu8.ticket.concert.admin.dto.command.UpdateConcertBasicInfoCommand;
import com.smu8.ticket.concert.admin.http.request.UpdateConcertBasicInfoRequest;
import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.concert.admin.http.request.UpdateConcertRequest;
import com.smu8.ticket.concert.admin.http.response.AdminConcertDetailResponse;
import com.smu8.ticket.concert.admin.service.AdminConcertService;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.dto.query.PageQuery;
import com.smu8.ticket.http.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

@SecurityRequirement(name = "Authorization")
@RestController
@RequiredArgsConstructor
public class AdminConcertController {
    private final AdminConcertService adminConcertService;

    @Operation(
            summary = "관리자 공연 등록",
            description = "관리자가 새로운 공연을 등록합니다.",
            requestBody = @RequestBody(content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    encoding = @Encoding(
                            name = "request",
                            contentType = MediaType.APPLICATION_JSON_VALUE
                    )
            ))
    )
    @PostMapping(
            value = "/api/admin/concerts",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
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
        ConcertDetailResult result = adminConcertService
                .createConcert(CreateConcertCommand.from(
                        createConcertRequest,
                        cardPoster,
                        bannerPoster,
                        descriptionPoster));
        return ResponseEntity
                .created(URI.create("/api/admin/concerts/" + result.id()))
                .body(AdminConcertDetailResponse.from(result));
    }

    @Operation(summary = "관리자 공연 목록 조회", description = "관리자가 등록된 공연 목록을 조회합니다.")
    @GetMapping("/api/admin/concerts")
    public ResponseEntity<PageResponse<AdminConcertDetailResponse>> getConcerts(
            @RequestParam(name = "concertNames", required = false) String concertNames,
            @RequestParam(name = "concertCode", required = false) String concertCode,
            @RequestParam(name = "page", defaultValue = "0", required = false) Integer page,
            @RequestParam(name = "size", defaultValue = "4", required = false) Integer size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "venueCode", required = false) String venueCode,
            @RequestParam(name = "venueNames", required = false) String venueNames
    ) {
        return ResponseEntity.ok(
                PageResponse.from(
                adminConcertService.getConcerts(
                        ConcertPageQuery.builder()
                                .pageQuery(PageQuery.builder().page(page).size(size).build())
                                .concertNames(parseQueryValues(concertNames))
                                .concertCode(concertCode)
                                .status(status)
                                .venueCode(venueCode)
                                .venueNames(venueNames)
                                .build()
                ),
                        AdminConcertDetailResponse::from));
    }

    @Operation(summary = "관리자 공연 상세 조회", description = "관리자가 공연 고유 ID로 공연 상세 정보를 조회합니다.")
    @GetMapping("/api/admin/concerts/{id}")
    public ResponseEntity<AdminConcertDetailResponse> getConcert(
            @Parameter(description = "조회할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(AdminConcertDetailResponse.from(adminConcertService.getConcert(ConcertDetailQuery.builder().id(id).build())));
    }

    @Operation(
            summary = "관리자 공연 수정",
            description = "관리자가 공연 정보를 수정합니다.",
            requestBody = @RequestBody(content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    encoding = @Encoding(
                            name = "request",
                            contentType = MediaType.APPLICATION_JSON_VALUE
                    )
            ))
    )
    @PostMapping(
            value = "/api/admin/concerts/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
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
        ConcertDetailResult result = adminConcertService.updateConcert(UpdateConcertCommand.from(id, updateConcertRequest));
        return ResponseEntity.ok(AdminConcertDetailResponse.from(result));
    }
    @Operation(
            summary = "관리자 공연 기본정보 수정",
            description = "관리자가 공연 제목/설명/러닝타임/포스터를 수정합니다. (일정/좌석 변경 없음)",
            requestBody = @RequestBody(content = @Content(
                    mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    encoding = @Encoding(
                            name = "request",
                            contentType = MediaType.APPLICATION_JSON_VALUE
                    )
            ))
    )
    @PatchMapping(
            value = "/api/admin/concerts/{id}/basic-info",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AdminConcertDetailResponse> updateConcertBasicInfo(
            @PathVariable Long id,
            @RequestPart(value = "cardPoster", required = false) MultipartFile cardPoster,
            @RequestPart(value = "bannerPoster", required = false) MultipartFile bannerPoster,
            @RequestPart(value = "descriptionPoster", required = false) MultipartFile descriptionPoster,
            @RequestPart(value = "request") UpdateConcertBasicInfoRequest request
    ) {
        ConcertDetailResult result = adminConcertService.updateConcertBasicInfo(
                UpdateConcertBasicInfoCommand.from(id, request, cardPoster, bannerPoster, descriptionPoster));
        return ResponseEntity.ok(AdminConcertDetailResponse.from(result));
    }

    @Operation(summary = "관리자 공연 취소", description = "관리자가 공연상태를 공연취소로 변경합니다.")
    @DeleteMapping("/api/admin/concerts/{id}")
    public ResponseEntity<Void> deleteConcert(
            @Parameter(description = "삭제할 공연 고유 ID", example = "1")
            @PathVariable Long id
    ) {
        adminConcertService.deleteConcert(id);
        return ResponseEntity.noContent().build();
    }

    // 공연명 검색은 쉼표로 여러 값을 받을 수 있어 빈 값을 제거한 리스트로 변환합니다.
    private List<String> parseQueryValues(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }

        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(queryValue -> !queryValue.isBlank())
                .toList();
    }
}
