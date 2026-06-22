package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private final ConcertRepository concertRepository;
    private final VenueRepository venueRepository;

    @Override
    public ConcertDetailResult createConcert(CreateConcertCommand command) {
        Venue venue = getVenueById(command.venueId());
        Concert concert = command.byId(UUID.randomUUID().toString(), venue);
        return ConcertDetailResult.from(concertRepository.save(concert));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConcertDetailResult> getConcerts() {
        return concertRepository.findAll().stream()
                .map(ConcertDetailResult::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(String id) {
        return ConcertDetailResult.from(getById(id));
    }

    @Override
    @Transactional
    public ConcertDetailResult updateConcert(UpdateConcertCommand command) {
        Concert concert = getById(command.id());
        Venue venue = getVenueById(command.venueId());
        command.update(concert, venue);
        return ConcertDetailResult.from(concert);
    }

    @Override
    public void deleteConcert(String id) {
        concertRepository.delete(getById(id));
    }

    private Concert getById(String id) {
        return concertRepository.findById(id).orElseThrow();
    }

    private Venue getVenueById(String venueId) {
        return venueRepository.findById(venueId).orElseThrow();
    }
}
