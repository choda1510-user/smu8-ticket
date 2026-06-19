package com.smu8.ticket.account.controller;

import com.smu8.ticket.account.dto.command.CreateAccountCommand;
import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.http.request.CreateAccountRequest;
import com.smu8.ticket.account.http.response.AccountDetailResponse;
import com.smu8.ticket.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/api/account")
    public ResponseEntity<AccountDetailResponse> signUp(
            @RequestBody CreateAccountRequest createAccountRequest
    ) {
        AccountDetailResult accountDetailResult = accountService
                .createAccount(CreateAccountCommand
                        .from(createAccountRequest));
        return ResponseEntity
                .created(URI.create(accountDetailResult.id()))
                .body(AccountDetailResponse
                        .from(accountDetailResult));
    }
}
