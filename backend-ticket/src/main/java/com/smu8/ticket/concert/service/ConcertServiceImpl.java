package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.file.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private static final String CANCELED_STATUS = "\uacf5\uc5f0\ucde8\uc18c";

    private final ConcertRepository concertRepository;
    private final StorageService storageService;
    private String getConcertName(ConcertPageQuery query) {
        if (query.concertNames() == null || query.concertNames().isEmpty()) {
            return null;
        }

        String concertName = query.concertNames().get(0);
        return concertName == null || concertName.isBlank() ? null : concertName.trim();
    }
    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query) {
        PageRequest pageRequest = PageRequest.of(
                query.pageQuery().page(),
                query.pageQuery().size()
        );
        String concertName = getConcertName(query);


        if ("upcoming".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findUpcomingConcerts(
                            CANCELED_STATUS,
                            LocalDateTime.now(),
                            concertName,
                            pageRequest
                    )
                    .map((concert -> ConcertDetailResult.from(concert, storageService))));
        }

        if ("open".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findOpenConcerts(
                            CANCELED_STATUS,
                            LocalDateTime.now(),
                            concertName,
                            pageRequest
                    )
                    .map((concert -> ConcertDetailResult.from(concert, storageService))));
        }

        return PageResult.from(concertRepository.findActiveConcerts(CANCELED_STATUS,concertName,pageRequest)
                .map((concert -> ConcertDetailResult.from(concert, storageService))));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()), storageService);
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }
}
