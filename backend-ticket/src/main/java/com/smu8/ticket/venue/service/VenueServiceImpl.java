package com.smu8.ticket.venue.service;

import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.dto.query.VenuePageQuery;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;

    @Override
    public PageResult<VenueDetailResult> getVenues(VenuePageQuery query) {
        return PageResult.from(venueRepository
                .findAll(
                        PageRequest.of(
                                query.pageQuery().page(),
                                query.pageQuery().size()))
                .map(VenueDetailResult::from));
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
