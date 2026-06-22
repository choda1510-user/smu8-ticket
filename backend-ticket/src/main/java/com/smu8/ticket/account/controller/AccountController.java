package com.smu8.ticket.account.controller;

import com.smu8.ticket.account.dto.command.CreateAccountCommand;
import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.http.request.CreateAccountRequest;
import com.smu8.ticket.account.http.request.UpdateAccountRequest;
import com.smu8.ticket.account.http.response.AccountDetailResponse;
import com.smu8.ticket.account.http.response.AvailabilityResponse;
import com.smu8.ticket.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/api/account/check-username")
    public ResponseEntity<AvailabilityResponse> checkUsername(
            @RequestParam String username
    ) {
        String trimmedUsername = username.trim();

        if (trimmedUsername.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new AvailabilityResponse(false));
        }

        return ResponseEntity.ok(new AvailabilityResponse(
                accountService.isUsernameAvailable(trimmedUsername)
        ));
    }

    @GetMapping("/api/account/check-nickname")
    public ResponseEntity<AvailabilityResponse> checkNickname(
            @RequestParam String nickname
    ) {
        String trimmedNickname = nickname.trim();

        if (trimmedNickname.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new AvailabilityResponse(false));
        }

        return ResponseEntity.ok(new AvailabilityResponse(
                accountService.isNicknameAvailable(trimmedNickname)
        ));
    }

    @GetMapping("/api/account/me")
    public ResponseEntity<AccountDetailResponse> me(Authentication authentication) {
        AccountDetailResult accountDetailResult = accountService.getById(authentication.getName());

        return ResponseEntity.ok(AccountDetailResponse.from(accountDetailResult));
    }

    @PatchMapping("/api/account/me")
    public ResponseEntity<AccountDetailResponse> updateMe(
            Authentication authentication,
            @RequestBody UpdateAccountRequest updateAccountRequest
    ) {
        AccountDetailResult accountDetailResult = accountService.updateAccount(
                authentication.getName(),
                updateAccountRequest.nickname(),
                updateAccountRequest.password()
        );

        return ResponseEntity.ok(AccountDetailResponse.from(accountDetailResult));
    }

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
