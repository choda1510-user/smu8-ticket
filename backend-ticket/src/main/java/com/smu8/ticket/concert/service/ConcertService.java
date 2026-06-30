package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.dto.result.PageResult;

import java.util.List;

public interface ConcertService {
    PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query);

    ConcertDetailResult getConcert(ConcertDetailQuery query);
}
