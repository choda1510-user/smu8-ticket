package com.smu8.ticket.reservation.admin.controller;

import com.smu8.ticket.http.response.PageResponse;
import com.smu8.ticket.reservation.admin.dto.command.CreateCancelReservationCommand;
import com.smu8.ticket.reservation.admin.dto.query.AdminReservationQuery;
import com.smu8.ticket.reservation.admin.http.request.AdminCreateCancelReservationRequest;
import com.smu8.ticket.reservation.admin.http.response.AdminReservationDetailResponse;
import com.smu8.ticket.reservation.admin.http.response.AdminReservationItemResponse;
import com.smu8.ticket.reservation.admin.service.AdminReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AdminReservationController {

    private final AdminReservationService adminReservationService;

    @GetMapping("/api/admin/reservations")
    public ResponseEntity<PageResponse<AdminReservationItemResponse>>getReservations(
            @RequestParam(name = "page", defaultValue = "0", required = false)
            Integer page,
            @RequestParam(name = "size", defaultValue = "4",  required = false)
            Integer size,
            @RequestParam(name = "accountId", required = false)
            String accountId
    ){
        return ResponseEntity.ok(
                PageResponse.from(
                        adminReservationService
                                .getReservations(AdminReservationQuery.from(page, size, accountId)),
                        AdminReservationItemResponse::from)
        );
    }

    @GetMapping("/api/admin/reservations/{id}")
    public ResponseEntity<AdminReservationDetailResponse> getReservation(@PathVariable Long id){
        return ResponseEntity.ok(
                AdminReservationDetailResponse.from(adminReservationService.getReservation(id))
        );
    }
    @PostMapping("/api/admin/reservations/{id}/cancel")
    public ResponseEntity<AdminReservationDetailResponse> cancelReservation(
            @PathVariable Long id,
            @RequestBody AdminCreateCancelReservationRequest request
    ){
        return ResponseEntity.ok(
                AdminReservationDetailResponse.from(
                        adminReservationService.cancelReservation(
                                CreateCancelReservationCommand.from(id,request)
                        )
                )
        );
    }
}
