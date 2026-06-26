package com.smu8.ticket.reservation.admin.http.response;

import com.smu8.ticket.reservation.admin.dto.result.AdminReservationItemResult;
import lombok.Builder;

@Builder
public record AdminReservationItemResponse() {
    public static AdminReservationItemResponse from(AdminReservationItemResult result) {
        return null;
    }
}
