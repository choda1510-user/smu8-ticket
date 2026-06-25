package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private final ConcertRepository concertRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts() {
        return PageResult.from(concertRepository
                .findAllByOrderByStartAtDesc(PageRequest.of(0, 10))
                .map(ConcertDetailResult::from));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()));
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }
}
