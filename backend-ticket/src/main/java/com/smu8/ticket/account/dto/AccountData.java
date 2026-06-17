package com.smu8.ticket.account.dto;

import com.smu8.ticket.account.entity.Account;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record AccountData(
        String id,
        String nickname,
        String username,
        String password,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AccountData from(Account account) {
        return AccountData.builder()
                .id(account.getId())
                .nickname(account.getNickname())
                .username(account.getUsername())
                .password(account.getPassword())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
