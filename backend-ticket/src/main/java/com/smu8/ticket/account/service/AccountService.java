package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.dto.command.CreateAccountCommand;

public interface AccountService {
    AccountDetailResult createAccount(CreateAccountCommand request);

}
