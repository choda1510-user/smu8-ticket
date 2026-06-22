package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;

public interface VenueService {
    VenueDetailResult createVenue(CreateVenueCommand command);
}
