package com.smu8.ticket.auth.service;

import com.smu8.ticket.auth.dto.command.CreateTokenCommand;
import com.smu8.ticket.auth.dto.command.RegisterTokenCommand;
import com.smu8.ticket.auth.dto.query.TokenQuery;
import com.smu8.ticket.auth.dto.result.BlacklistTokenResult;
import com.smu8.ticket.auth.dto.result.TokenResult;

public interface TokenService {
    TokenResult createToken(CreateTokenCommand command);
    BlacklistTokenResult setBlacklistToken(RegisterTokenCommand command);
    Boolean checkAccessToken(TokenQuery query);
    Boolean checkRefreshToken(TokenQuery query);
}
