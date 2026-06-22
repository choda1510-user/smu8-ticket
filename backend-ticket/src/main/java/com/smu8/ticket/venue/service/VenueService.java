package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.command.UpdateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;

import java.util.List;

public interface VenueService {
    VenueDetailResult createVenue(CreateVenueCommand command);

    List<VenueDetailResult> getVenues();

    VenueDetailResult getVenue(String id);

    VenueDetailResult updateVenue(UpdateVenueCommand command);

    void deleteVenue(String id);
}
