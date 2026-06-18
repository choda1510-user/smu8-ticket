package com.smu8.ticket.account.http.response;

import com.smu8.ticket.account.entity.Account;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AccountDetailResponse(
        String id,
        String nickname,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AccountDetailResponse from(Account account) {
        return AccountDetailResponse.builder()
                .id(account.getId())
                .nickname(account.getNickname())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
