package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;

import java.util.List;

public interface ConcertService {
    ConcertDetailResult createConcert(CreateConcertCommand command);

    List<ConcertDetailResult> getConcerts();

    ConcertDetailResult getConcert(String id);

    ConcertDetailResult updateConcert(UpdateConcertCommand command);

    void deleteConcert(String id);
}
