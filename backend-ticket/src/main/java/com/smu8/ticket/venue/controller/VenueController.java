package com.smu8.ticket.venue.controller;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.http.request.CreateVenueRequest;
import com.smu8.ticket.venue.http.response.VenueDetailResponse;
import com.smu8.ticket.venue.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        VenueDetailResult result = venueService.createVenue(CreateVenueCommand.builder()
                .name(createVenueRequest.name())
                .zoneNo(createVenueRequest.zoneNo())
                .roadAddress(createVenueRequest.roadAddress())
                .jibunAddress(createVenueRequest.jibunAddress())
                .detailAddress(createVenueRequest.detailAddress())
                .buildingName(createVenueRequest.buildingName())
                .build());
        return ResponseEntity
                .created(URI.create("/api/admin/venues/" + result.id()))
                .body(VenueDetailResponse.from(result));
    }
}
