package com.smu8.ticket.account.http.response;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AccountMyInfoResponse(
        @Schema(description = "회원 고유 ID", example = "550e8400-e29b-41d4-a716-446655440000")
        String id,
        @Schema(description = "아이디")
        String username,
        @Schema(description = "닉네임", example = "홍길동")
        String nickname,
        @Schema(description = "역할", example = "USER")
        String role,
        @Schema(description = "생성일시", example = "2026-06-22T10:30:00")
        LocalDateTime createdAt,
        @Schema(description = "수정일시", example = "2026-06-22T10:30:00")
        LocalDateTime updatedAt
) {
    public static AccountMyInfoResponse from(AccountDetailResult result) {
        return AccountMyInfoResponse.builder()
                .id(result.id())
                .username(result.username())
                .nickname(result.nickname())
                .role(result.admin() ? "ADMIN" : "USER")
                .createdAt(result.createdAt())
                .updatedAt(result.updatedAt())
                .build();
    }
}
