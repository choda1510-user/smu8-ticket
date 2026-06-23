package com.smu8.ticket.account.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateAccountRequest(
        @Schema(description = "로그인 아이디", example = "testuser")
        String username,
        @Schema(description = "비밀번호", example = "password1234")
        String password,
        @Schema(description = "닉네임", example = "홍길동")
        String nickname
) {
}
