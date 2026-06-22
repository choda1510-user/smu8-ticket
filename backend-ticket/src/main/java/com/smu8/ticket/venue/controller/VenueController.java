package com.smu8.ticket.venue.controller;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.command.UpdateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.http.request.CreateVenueRequest;
import com.smu8.ticket.venue.http.request.UpdateVenueRequest;
import com.smu8.ticket.venue.http.response.VenueDetailResponse;
import com.smu8.ticket.venue.http.response.VenueListResponse;
import com.smu8.ticket.venue.service.VenueService;
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
public class VenueController {
    private final VenueService venueService;

    @PostMapping("/api/admin/venues")
    public ResponseEntity<VenueDetailResponse> createVenue(
            @RequestBody CreateVenueRequest createVenueRequest
    ) {
        VenueDetailResult result = venueService.createVenue(CreateVenueCommand.from(createVenueRequest));
        return ResponseEntity
                .created(URI.create(result.id()))
                .body(VenueDetailResponse.from(result));
    }

    @GetMapping("/api/admin/venues")
    public ResponseEntity<VenueListResponse> getVenues() {
        return ResponseEntity.ok(VenueListResponse.from(venueService.getVenues()));
    }

    @GetMapping("/api/admin/venues/{id}")
    public ResponseEntity<VenueDetailResponse> getVenue(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(VenueDetailResponse.from(venueService.getVenue(id)));
    }

    @PatchMapping("/api/admin/venues/{id}")
    public ResponseEntity<VenueDetailResponse> updateVenue(
            @PathVariable String id,
            @RequestBody UpdateVenueRequest updateVenueRequest
    ) {
        VenueDetailResult result = venueService.updateVenue(UpdateVenueCommand.from(id, updateVenueRequest));
        return ResponseEntity.ok(VenueDetailResponse.from(result));
    }

    @DeleteMapping("/api/admin/venues/{id}")
    public ResponseEntity<Void> deleteVenue(
            @PathVariable String id
    ) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
