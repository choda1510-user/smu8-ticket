package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.UserConcertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private final UserConcertRepository concertRepository;

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

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }
}
