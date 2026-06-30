package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private final ConcertRepository concertRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query) {
        PageRequest pageRequest = PageRequest.of(
                query.pageQuery().page(),
                query.pageQuery().size()
        );

        if ("upcoming".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findDistinctByPerformanceSchedulesReservationStartAtAfter(
                            LocalDateTime.now(),
                            pageRequest
                    )
                    .map(ConcertDetailResult::from));
        }

        if ("open".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findDistinctByPerformanceSchedulesReservationStartAtLessThanEqual(
                            LocalDateTime.now(),
                            pageRequest
                    )
                    .map(ConcertDetailResult::from));
        }

        return PageResult.from(concertRepository.findAll(pageRequest)
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
