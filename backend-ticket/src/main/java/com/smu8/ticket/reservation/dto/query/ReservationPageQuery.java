package com.smu8.ticket.reservation.dto.query;

import com.smu8.ticket.dto.query.PageQuery;
import lombok.Builder;

@Builder
public record ReservationPageQuery(
        PageQuery pageQuery,
        String accountId
) {
    public static ReservationPageQuery of(PageQuery pageQuery, String accountId) {
        return ReservationPageQuery.builder()
                .pageQuery(pageQuery)
                .accountId(accountId)
                .build();
    }
}
