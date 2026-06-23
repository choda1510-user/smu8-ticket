package com.smu8.ticket.venue.controller;

import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.http.response.VenueDetailResponse;
import com.smu8.ticket.venue.http.response.VenueListResponse;
import com.smu8.ticket.venue.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;

    @GetMapping("/api/venues")
    public ResponseEntity<VenueListResponse> getVenues() {
        return ResponseEntity.ok(VenueListResponse.from(venueService.getVenues()));
    }

    @GetMapping("/api/venues/{id}")
    public ResponseEntity<VenueDetailResponse> getVenue(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(VenueDetailResponse.from(venueService.getVenue(VenueDetailQuery.builder()
                .id(id)
                .build())));
    }
}
