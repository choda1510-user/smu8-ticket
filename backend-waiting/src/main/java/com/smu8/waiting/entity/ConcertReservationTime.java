package com.smu8.waiting.entity;

import lombok.*;

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
