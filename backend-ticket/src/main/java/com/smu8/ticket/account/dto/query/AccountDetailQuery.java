package com.smu8.ticket.account.dto.query;

import lombok.Builder;

@Builder
public record AccountDetailQuery(
        String id
) {
    public static AccountDetailQuery of(String id) {
        return AccountDetailQuery.builder().id(id).build();
    }
}
