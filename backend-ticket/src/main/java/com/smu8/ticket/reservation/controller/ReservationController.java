package com.smu8.ticket.reservation.controller;

import com.smu8.ticket.dto.query.PageQuery;
import com.smu8.ticket.http.response.PageResponse;
import com.smu8.ticket.reservation.dto.command.CreateReservationCommand;
import com.smu8.ticket.reservation.dto.query.ReservationPageQuery;
import com.smu8.ticket.reservation.http.request.CreateReservationRequest;
import com.smu8.ticket.reservation.http.response.ReservationDetailResponse;
import com.smu8.ticket.reservation.http.response.ReservationItemResponse;
import com.smu8.ticket.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    // 예매 목록 요청, 자신의 예매만 조회.
    @GetMapping("/api/reservations")
    public ResponseEntity<PageResponse<ReservationItemResponse>> findReservations(
            @RequestParam(name = "page", defaultValue = "0", required = false)
            Integer page,
            @RequestParam(name = "size", defaultValue = "4",  required = false)
            Integer size,
            Authentication authentication
    ) {
        return ResponseEntity
                .ok(PageResponse
                        .from(reservationService.getReservations(ReservationPageQuery.of(PageQuery.of(page, size), getAccountId(authentication))),
                                ReservationItemResponse::from));
    }
    // 예매 상세 요청, 자신의 예매만 조회.
    @GetMapping("/api/reservations/{reservationId}")
    public ResponseEntity<ReservationDetailResponse> findReservation(
            @PathVariable Long reservationId,
            Authentication authentication
    ){
        return ResponseEntity.ok(
                ReservationDetailResponse.from(
                        reservationService.getReservation(reservationId, getAccountId(authentication))
                )
        );
    }
    // 예매 요청
    @PostMapping("/api/reservations")
    public ResponseEntity<ReservationItemResponse> createReservation(
            @RequestBody CreateReservationRequest request,
            Authentication authentication
            ) {
        return ResponseEntity.ok(
                ReservationItemResponse.from(
                        reservationService.createReservation(
                                CreateReservationCommand.from(getAccountId(authentication), request)
                        )
                )
        );
    }
    // 예매 취소 요청
    @DeleteMapping("/api/reservations/{reservationId}")
    public ResponseEntity<ReservationItemResponse> cancelReservation(
            @PathVariable(name = "reservationId")
            Long reservationId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ReservationItemResponse.from(
                        reservationService.cancelReservation(reservationId, getAccountId(authentication))
                )
        );
    }

    private String getAccountId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return authentication.getName();
    }
}
