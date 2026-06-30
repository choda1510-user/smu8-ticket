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
        String venueName = query.venueNames() == null || query.venueNames().isEmpty()
                ? null
                : trimToNull(query.venueNames().get(0));

        return PageResult.from(venueRepository
                .search(
                        venueName,
                        parseId(query.venueCode()),
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

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private Long parseId(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Long.valueOf(value.trim());
        } catch (NumberFormatException exception) {
            return -1L;
        }
    }
}
