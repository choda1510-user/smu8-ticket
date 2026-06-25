package com.smu8.ticket.reservation.admin.dto.query;

import com.smu8.ticket.dto.query.PageQuery;
import lombok.Builder;

@Builder
public record AdminReservationQuery(
        PageQuery pageQuery,
        String accountId
) {
}
