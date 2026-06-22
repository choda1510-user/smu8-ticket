package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.result.AccountDetailResult;

public interface AccountAuthenticationService {
    AccountDetailResult getById(String id);
    AccountDetailResult getByUsername(String username);
}
