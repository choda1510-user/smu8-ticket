package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;

import java.util.List;

public interface ConcertService {
    List<ConcertDetailResult> getConcerts();

    ConcertDetailResult getConcert(Long id);
    ConcertDetailResult updateConcert(UpdateConcertCommand command);
    void deleteConcert(Long id);

}
