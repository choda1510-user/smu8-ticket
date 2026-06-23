package com.smu8.ticket.venue.admin.service;

import com.smu8.ticket.venue.admin.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.admin.dto.command.UpdateVenueCommand;
import com.smu8.ticket.venue.admin.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;

import java.util.List;

public interface VenueService {
    VenueDetailResult createVenue(CreateVenueCommand command);

    List<VenueDetailResult> getVenues();

    VenueDetailResult getVenue(VenueDetailQuery query);

    VenueDetailResult updateVenue(UpdateVenueCommand command);

    void deleteVenue(Long id);
}
