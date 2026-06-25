package com.smu8.ticket.venue.controller;

import com.smu8.ticket.http.response.PageInfoResponse;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.dto.query.VenuePageQuery;
import com.smu8.ticket.venue.http.response.VenueItemResponse;
import com.smu8.ticket.venue.http.response.VenueListResponse;
import com.smu8.ticket.venue.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;

    @GetMapping("/api/venues")
    public ResponseEntity<PageInfoResponse<VenueItemResponse>> getVenues(
            @RequestParam(name = "venueNames") String venueNames,
            @RequestParam(name = "page", defaultValue = "0") Integer page,
            @RequestParam(name = "size", defaultValue = "4") Integer size
    ) {
        return ResponseEntity
                .ok(PageInfoResponse.from(venueService.getVenues(VenuePageQuery.builder()
                        .page(page)
                        .size(size)
                        .build()), VenueItemResponse::from));
    }

    @GetMapping("/api/venues/{id}")
    public ResponseEntity<VenueItemResponse> getVenue(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(VenueItemResponse.from(venueService.getVenue(VenueDetailQuery.builder()
                .id(id)
                .build())));
    }
}
