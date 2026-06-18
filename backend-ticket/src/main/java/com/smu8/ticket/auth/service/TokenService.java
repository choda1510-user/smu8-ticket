package com.smu8.ticket.auth.service;

import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.dto.result.TokenResult;

public interface TokenService {
    TokenResult getToken(TokenQuery query);
}
