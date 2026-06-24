package com.smu8.ticket.account.http.response;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminAccountResponse(
        @Schema(description = "관리자 고유 ID", example = "550e8400-e29b-41d4-a716-446655440000")
        String id,
        @Schema(description = "관리자 로그인 아이디", example = "adminuser")
        String username,
        @Schema(description = "관리자 닉네임", example = "관리자1")
        String nickname,
        @Schema(description = "관리자 권한 여부", example = "true")
        boolean admin,
        @Schema(description = "생성일시", example = "2026-06-22T10:30:00")
        LocalDateTime createdAt,
        @Schema(description = "수정일시", example = "2026-06-22T10:30:00")
        LocalDateTime updatedAt
) {
    public static AdminAccountResponse from(AccountDetailResult accountDetailResult) {
        return AdminAccountResponse.builder()
                .id(accountDetailResult.id())
                .username(accountDetailResult.username())
                .nickname(accountDetailResult.nickname())
                .admin(accountDetailResult.admin())
                .createdAt(accountDetailResult.createdAt())
                .updatedAt(accountDetailResult.updatedAt())
                .build();
    }
}
