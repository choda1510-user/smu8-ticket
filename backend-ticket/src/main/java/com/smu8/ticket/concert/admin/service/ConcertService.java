package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;

import java.util.List;

public interface ConcertService {
    ConcertDetailResult createConcert(CreateConcertCommand command);

    List<ConcertDetailResult> getConcerts();

    ConcertDetailResult getConcert(ConcertDetailQuery query);

    ConcertDetailResult updateConcert(UpdateConcertCommand command);

    void deleteConcert(Long id);
}
