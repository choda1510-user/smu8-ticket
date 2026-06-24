package com.smu8.ticket.reservation.admin.http.response;

import com.smu8.ticket.reservation.admin.dto.result.AdminReservationListResult;
import lombok.Builder;

import java.util.List;

@Builder
public class AdminReservationListResponse (
        List<AdminReservationDetailResponse> reservations
){
    public static AdminReservationListResponse from(List<AdminReservationListResult> results) {
        return AdminReservationListResponse.builder()
                .reservations(results.stream()
                        .map(AdminReservationDetailResponse::from)
                        .toList())
                .build();
    }
}
