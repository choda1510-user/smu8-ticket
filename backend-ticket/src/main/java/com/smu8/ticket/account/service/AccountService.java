package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.AccountData;
import com.smu8.ticket.account.dto.CreateAccount;

public interface AccountService {
    AccountData createAccount(CreateAccount request);

}
