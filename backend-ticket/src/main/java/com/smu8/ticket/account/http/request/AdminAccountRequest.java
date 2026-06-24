package com.smu8.ticket.account.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record AdminAccountRequest(
        @Schema(description = "관리자로 변경할 사용자 아이디", example = "adminuser")
        String username
) {
}
