package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.admin.repository.ConcertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private final ConcertRepository concertRepository;

    private final VenueRepository venueRepository;

    @Override
    public ConcertDetailResult createConcert(CreateConcertCommand command) {
        Venue venue = getVenueById(command.venueId());
        Concert concert = command.toEntity(venue);
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
    public ConcertDetailResult getConcert(Long id) {
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
    public void deleteConcert(Long id) {
        concertRepository.delete(getById(id));
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }

    private Venue getVenueById(Long venueId) {
        return venueRepository.findById(venueId).orElseThrow();
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }

}
