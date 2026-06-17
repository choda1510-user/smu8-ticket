package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.AccountData;

public interface AccountAuthenticationService {
    AccountData getById(String id);
    AccountData getByUsername(String username);
}
