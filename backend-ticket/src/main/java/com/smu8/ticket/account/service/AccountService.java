package com.smu8.ticket.account.service;

import com.smu8.ticket.account.dto.command.AdminAccountCommand;
import com.smu8.ticket.account.dto.command.CreateAccountCommand;
import com.smu8.ticket.account.dto.query.AccountDetailQuery;
import com.smu8.ticket.account.dto.result.AccountDetailResult;

public interface AccountService {
    AccountDetailResult createAccount(CreateAccountCommand request);
    AccountDetailResult updateAdmin(AdminAccountCommand command);
    boolean isUsernameAvailable(String username);
    boolean isNicknameAvailable(String nickname);
    AccountDetailResult getById(AccountDetailQuery query);
    AccountDetailResult updateAccount(String id, String nickname, String password);

}
