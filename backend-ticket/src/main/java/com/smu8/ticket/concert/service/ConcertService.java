package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;

import java.util.List;

public interface ConcertService {
    List<ConcertDetailResult> getConcerts();

    ConcertDetailResult getConcert(Long id);
}
