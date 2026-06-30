package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.command.UpdateConcertBasicInfoCommand;
import com.smu8.ticket.concert.admin.dto.command.CreateConcertCommand;
import com.smu8.ticket.concert.admin.dto.command.UpdateConcertCommand;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.dto.result.PageResult;

public interface AdminConcertService {
    ConcertDetailResult createConcert(CreateConcertCommand command);

    PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query);

    ConcertDetailResult getConcert(ConcertDetailQuery query);

    ConcertDetailResult updateConcert(UpdateConcertCommand command);

    ConcertDetailResult updateConcertBasicInfo(UpdateConcertBasicInfoCommand command);

    void deleteConcert(Long id);
}
