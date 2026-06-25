package com.smu8.ticket.reservation.admin.controller;

import com.smu8.ticket.reservation.admin.dto.command.CancelReservationCommand;
import com.smu8.ticket.reservation.admin.http.request.CancelReservationRequest;
import com.smu8.ticket.reservation.admin.http.response.AdminReservationDetailResponse;
import com.smu8.ticket.reservation.admin.http.response.AdminReservationListResponse;
import com.smu8.ticket.reservation.admin.service.AdminReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AdminReservationController {

    private final AdminReservationService adminReservationService;

    @GetMapping("/api/admin/reservations")
    public ResponseEntity<AdminReservationListResponse>getReservations(){
        return ResponseEntity.ok(
                AdminReservationListResponse.from(adminReservationService.getReservations())
        );
    }

    @GetMapping("/api/admin/reservations/{id}")
    public ResponseEntity<AdminReservationDetailResponse> getReservation(@PathVariable Long id){
        return ResponseEntity.ok(
                AdminReservationDetailResponse.from(adminReservationService.getReservation(id))
        );
    }
    @PatchMapping("/api/admin/reservations/{id}/cancel")
    public ResponseEntity<AdminReservationDetailResponse> cancelReservation(
            @PathVariable Long id,
            @RequestBody CancelReservationRequest request
    ){
        return ResponseEntity.ok(
                AdminReservationDetailResponse.from(
                        adminReservationService.cancelReservation(
                                CancelReservationCommand.from(id,request)
                        )
                )
        );
    }
}
