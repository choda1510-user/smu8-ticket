package com.smu8.ticket.reservation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "RESERVATION")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(name = "reservation_no", nullable = false, unique = true, length = 50)
    private String reservationNo;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "round_id", nullable = false)
    private Long roundId;

    @Column(name = "reservation_status", nullable = false, length = 30)
    private String reservationStatus;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Column(name = "reserved_at", nullable = false)
    private LocalDateTime reservedAt;
}