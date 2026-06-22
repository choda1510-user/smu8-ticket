package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.command.UpdateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;

    @Override
    public VenueDetailResult createVenue(CreateVenueCommand command) {
        Venue venue = command.byId(UUID.randomUUID().toString());
        return VenueDetailResult.from(venueRepository.save(venue));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueDetailResult> getVenues() {
        return venueRepository.findAll().stream()
                .map(VenueDetailResult::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VenueDetailResult getVenue(String id) {
        return VenueDetailResult.from(getById(id));
    }

    @Override
    @Transactional
    public VenueDetailResult updateVenue(UpdateVenueCommand command) {
        Venue venue = getById(command.id());
        command.update(venue);
        return VenueDetailResult.from(venue);
    }

    @Override
    public void deleteVenue(String id) {
        venueRepository.delete(getById(id));
    }

    private Venue getById(String id) {
        return venueRepository.findById(id).orElseThrow();
    }
}
