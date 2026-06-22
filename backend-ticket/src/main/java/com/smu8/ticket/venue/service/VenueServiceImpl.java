package com.smu8.ticket.venue.service;

import com.smu8.ticket.venue.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.entity.Address;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;

    @Override
    @Transactional
    public VenueDetailResult createVenue(CreateVenueCommand command) {
        Address address = Address.builder()
                .zoneNo(command.zoneNo())
                .roadAddress(command.roadAddress())
                .jibunAddress(command.jibunAddress())
                .detailAddress(command.detailAddress())
                .buildingName(command.buildingName())
                .build();
        Venue venue = Venue.builder()
                .name(command.name())
                .address(address)
                .build();
        return VenueDetailResult.from(venueRepository.save(venue));
    }
}
