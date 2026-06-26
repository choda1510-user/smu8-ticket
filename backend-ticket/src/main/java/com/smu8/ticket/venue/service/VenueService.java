package com.smu8.ticket.venue.service;

import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.dto.query.VenuePageQuery;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;

public interface VenueService {
    PageResult<VenueDetailResult> getVenues(VenuePageQuery query);

    VenueDetailResult getVenue(VenueDetailQuery query);
}
