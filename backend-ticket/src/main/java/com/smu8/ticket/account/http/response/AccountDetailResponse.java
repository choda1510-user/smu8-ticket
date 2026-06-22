package com.smu8.ticket.account.http.response;

import com.smu8.ticket.account.dto.result.AccountDetailResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AccountDetailResponse(
        String id,
        String username,
        String nickname,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AccountDetailResponse from(AccountDetailResult accountDetailResult) {
        return AccountDetailResponse.builder()
                .id(accountDetailResult.id())
                .username(accountDetailResult.username())
                .nickname(accountDetailResult.nickname())
                .createdAt(accountDetailResult.createdAt())
                .updatedAt(accountDetailResult.updatedAt())
                .build();
    }
}
