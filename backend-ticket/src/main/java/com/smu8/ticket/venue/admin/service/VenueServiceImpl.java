package com.smu8.ticket.venue.admin.service;

import com.smu8.ticket.venue.admin.dto.command.CreateVenueCommand;
import com.smu8.ticket.venue.admin.dto.command.UpdateVenueCommand;
import com.smu8.ticket.venue.dto.result.VenueDetailResult;
import com.smu8.ticket.venue.dto.query.VenueDetailQuery;
import com.smu8.ticket.venue.entity.Address;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("adminVenueServiceImpl")
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;

    @Override
    @Transactional
    public VenueDetailResult createVenue(CreateVenueCommand command) {
        Venue venue = Venue.builder()
                .name(command.name())
                .address(createAddress(
                        command.zoneNo(),
                        command.roadAddress(),
                        command.jibunAddress(),
                        command.detailAddress(),
                        command.buildingName()
                ))
                .build();

        return VenueDetailResult.from(venueRepository.save(venue));
    }

    @Override
    public VenueDetailResult getVenue(VenueDetailQuery query) {
        return VenueDetailResult.from(getById(query.id()));
    }

    @Override
    @Transactional
    public VenueDetailResult updateVenue(UpdateVenueCommand command) {
        Venue venue = getById(command.id());
        venue.setName(command.name());
        venue.setAddress(createAddress(
                command.zoneNo(),
                command.roadAddress(),
                command.jibunAddress(),
                command.detailAddress(),
                command.buildingName()
        ));

        return VenueDetailResult.from(venue);
    }

    @Override
    @Transactional
    public void deleteVenue(Long id) {
        venueRepository.delete(getById(id));
    }

    private Venue getById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공연장입니다."));
    }

    private Address createAddress(
            String zoneNo,
            String roadAddress,
            String jibunAddress,
            String detailAddress,
            String buildingName
    ) {
        return Address.builder()
                .zoneNo(zoneNo)
                .roadAddress(roadAddress)
                .jibunAddress(jibunAddress)
                .detailAddress(detailAddress)
                .buildingName(buildingName)
                .build();
    }
}
