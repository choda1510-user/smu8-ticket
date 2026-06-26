package com.smu8.ticket.reservation.controller;

import com.smu8.ticket.http.response.PageResponse;
import com.smu8.ticket.reservation.http.request.CreateReservationRequest;
import com.smu8.ticket.reservation.http.response.ReservationItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ReservationController {
    @GetMapping("/api/reservations")
    public ResponseEntity<PageResponse<ReservationItemResponse>> findReservations(
            @RequestParam(name = "page", defaultValue = "0", required = false)
            Integer page,
            @RequestParam(name = "size", defaultValue = "4",  required = false)
            Integer size,
            Authentication authentication
    ) {
        return ResponseEntity.ok().body(null);
    }
    @PostMapping("/api/reservations")
    public ResponseEntity<ReservationItemResponse> createReservation(
            @RequestBody CreateReservationRequest request,
            Authentication authentication
            ) {
        return ResponseEntity.ok().body(null);
    }
    @DeleteMapping("/api/reservations/{reservationId}")
    public ResponseEntity<ReservationItemResponse> cancelReservation(
            @PathVariable(name = "reservationId")
            Long reservationId,
            Authentication authentication
    ) {
        return ResponseEntity.ok().body(null);
    }
}
