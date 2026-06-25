package com.smu8.ticket.reservation.dto.query;

import com.smu8.ticket.dto.query.PageQuery;

public record ReservationPageQuery(
        PageQuery pageQuery,
        String accountId
) {
}
