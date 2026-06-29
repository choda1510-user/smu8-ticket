package com.smu8.ticket.venue.admin.controller;

import com.smu8.ticket.venue.admin.dto.command.AdminCreateVenueCommand;
import com.smu8.ticket.venue.admin.dto.command.AdminUpdateVenueCommand;
import com.smu8.ticket.venue.admin.http.response.AdminVenueItemResponse;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.admin.http.request.AdminUpdateVenueRequest;
import com.smu8.ticket.venue.admin.http.request.AdminCreateVenueRequest;
import com.smu8.ticket.venue.http.response.VenueItemResponse;
import com.smu8.ticket.venue.admin.service.VenueService;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import io.swagger.v3.oas.annotations.Operation;
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
public class AdminVenueController {
    private final VenueService venueService;

    @Operation(summary = "공연장 등록", description = "관리자가 새로운 공연장을 등록합니다.")
    @PostMapping("/api/admin/venues")
    public ResponseEntity<VenueItemResponse> createVenue(
            @RequestBody AdminCreateVenueRequest request
    ) {
        VenueDetailResult result = venueService.createVenue(AdminCreateVenueCommand.builder()
                .name(request.name())
                .zoneNo(request.zoneNo())
                .roadAddress(request.roadAddress())
                .jibunAddress(request.jibunAddress())
                .detailAddress(request.detailAddress())
                .buildingName(request.buildingName())
                .build());

        return ResponseEntity
                .created(URI.create("/api/admin/venues/" + result.id()))
                .body(VenueItemResponse.from(result));
    }

    @GetMapping("/api/admin/venues/{id}")
    public ResponseEntity<AdminVenueItemResponse> getVenue(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(AdminVenueItemResponse.from(venueService.getVenue(VenueDetailQuery.builder()
                .id(id)
                .build())));
    }
    @PatchMapping("/api/admin/venues/{id}")
    public ResponseEntity<VenueItemResponse> updateVenue(
            @PathVariable Long id,
            @RequestBody AdminUpdateVenueRequest request
    ) {
        return ResponseEntity.ok(VenueItemResponse.from(venueService.updateVenue(AdminUpdateVenueCommand.from(id, request))));
    }

    @DeleteMapping("/api/admin/venues/{id}")
    public ResponseEntity<Void> deleteVenue(
            @PathVariable Long id
    ) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
