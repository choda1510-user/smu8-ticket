package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;

import java.util.List;

public interface VenueService {
    List<VenueDetailResult> getVenues();

    VenueDetailResult getVenue(VenueDetailQuery query);
}
