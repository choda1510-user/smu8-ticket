package com.smu8.ticket.account.http.response;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AdminAccountResponse(
        String id,
        String username,
        String nickname,
        boolean admin,
        LocalDateTime createdAt,
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
