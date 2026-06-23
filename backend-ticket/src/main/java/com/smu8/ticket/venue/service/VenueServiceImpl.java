package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;

    @Override
    public List<VenueDetailResult> getVenues() {
        return venueRepository.findAll()
                .stream()
                .map(VenueDetailResult::from)
                .toList();
    }

    @Override
    public VenueDetailResult getVenue(VenueDetailQuery query) {
        return VenueDetailResult.from(getById(query.id()));
    }

    private Venue getById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공연장입니다."));
    }
}
