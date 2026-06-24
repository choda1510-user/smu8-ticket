package com.smu8.ticket.account.controller;

import com.smu8.ticket.account.dto.command.AdminAccountCommand;
import com.smu8.ticket.account.dto.command.CreateAccountCommand;
import com.smu8.ticket.account.dto.result.AccountDetailResult;
import com.smu8.ticket.account.http.request.AdminAccountRequest;
import com.smu8.ticket.account.http.request.CreateAccountRequest;
import com.smu8.ticket.account.http.response.AdminAccountResponse;
import com.smu8.ticket.account.http.request.UpdateAccountRequest;
import com.smu8.ticket.account.http.response.AccountDetailResponse;
import com.smu8.ticket.account.http.response.AvailabilityResponse;
import com.smu8.ticket.account.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @Operation(summary = "아이디 중복 확인", description = "회원가입에 사용할 로그인 아이디의 사용 가능 여부를 확인합니다.")
    @GetMapping("/api/account/check-username")
    public ResponseEntity<AvailabilityResponse> checkUsername(
            @Parameter(description = "중복 확인할 로그인 아이디", example = "testuser")
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

    @Operation(summary = "닉네임 중복 확인", description = "회원가입에 사용할 닉네임의 사용 가능 여부를 확인합니다.")
    @GetMapping("/api/account/check-nickname")
    public ResponseEntity<AvailabilityResponse> checkNickname(
            @Parameter(description = "중복 확인할 닉네임", example = "홍길동")
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

    @Operation(summary = "내 정보 조회", description = "현재 로그인한 회원의 정보를 조회합니다.")
    @GetMapping("/api/account/me")
    public ResponseEntity<AccountDetailResponse> me(
            @Parameter(hidden = true) Authentication authentication
    ) {
        AccountDetailResult accountDetailResult = accountService.getById(authentication.getName());

        return ResponseEntity.ok(AccountDetailResponse.from(accountDetailResult));
    }

    @Operation(summary = "내 정보 수정", description = "현재 로그인한 회원의 닉네임 또는 비밀번호를 수정합니다.")
    @PatchMapping("/api/account/me")
    public ResponseEntity<AccountDetailResponse> updateMe(
            @Parameter(hidden = true) Authentication authentication,
            @RequestBody UpdateAccountRequest updateAccountRequest
    ) {
        AccountDetailResult accountDetailResult = accountService.updateAccount(
                authentication.getName(),
                updateAccountRequest.nickname(),
                updateAccountRequest.password()
        );

        return ResponseEntity.ok(AccountDetailResponse.from(accountDetailResult));
    }

    @Operation(summary = "회원가입", description = "아이디, 비밀번호, 닉네임을 입력해 회원 계정을 생성합니다.")
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

    @Operation(summary = "관리자 권한 부여", description = "지정한 회원 계정을 관리자 계정으로 변경합니다.")
    @PostMapping("/api/account/admin")
    public ResponseEntity<AdminAccountResponse> updateAdmin(
            @RequestBody AdminAccountRequest adminAccountRequest
    ) {
        AccountDetailResult accountDetailResult = accountService
                .updateAdmin(AdminAccountCommand.builder()
                        .username(adminAccountRequest.username())
                        .build());
        return ResponseEntity
                .ok(AdminAccountResponse
                        .from(accountDetailResult));
    }
}
