package com.smu8.ticket.account.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateAccountRequest(
        @Schema(description = "변경할 닉네임", example = "새로운닉네임")
        String nickname,
        @Schema(description = "변경할 비밀번호", example = "newPassword1234")
        String password
) {
}
