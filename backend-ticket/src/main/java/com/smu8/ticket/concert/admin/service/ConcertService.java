package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.admin.dto.result.ConcertDetailResult;

import java.util.List;

public interface ConcertService {
    ConcertDetailResult createConcert(CreateConcertCommand command);

    List<ConcertDetailResult> getConcerts();

    ConcertDetailResult getConcert(Long id);

    ConcertDetailResult updateConcert(UpdateConcertCommand command);

    void deleteConcert(Long id);
}
