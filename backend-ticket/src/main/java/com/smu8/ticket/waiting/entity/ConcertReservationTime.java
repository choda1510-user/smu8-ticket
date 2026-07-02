package com.smu8.ticket.waiting.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConcertReservationTime {
    private String concertId;
    private LocalDateTime reservationStartDate;
    private LocalDateTime reservationLastEndDate;
}
