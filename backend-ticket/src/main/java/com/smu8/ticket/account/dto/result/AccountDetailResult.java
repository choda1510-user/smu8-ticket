package com.smu8.ticket.account.dto.result;

import com.smu8.ticket.account.entity.Account;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AccountDetailResult(
        String id,
        String nickname,
        String username,
        String password,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AccountDetailResult from(Account account) {
        return AccountDetailResult.builder()
                .id(account.getId())
                .nickname(account.getNickname())
                .username(account.getUsername())
                .password(account.getPassword())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
