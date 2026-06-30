package com.smu8.ticket.venue.admin.service;

import com.smu8.ticket.venue.admin.dto.command.AdminCreateVenueCommand;
import com.smu8.ticket.venue.admin.dto.command.AdminUpdateVenueCommand;
import com.smu8.ticket.venue.admin.dto.result.AdminVenueDetailResult;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;

public interface VenueService {
    VenueDetailResult createVenue(AdminCreateVenueCommand command);

    AdminVenueDetailResult getVenue(VenueDetailQuery query);

    VenueDetailResult updateVenue(AdminUpdateVenueCommand command);

    void deleteVenue(Long id);
}
