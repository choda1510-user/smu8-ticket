package com.smu8.ticket.concert.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "performance_schedule")
public class PerformanceSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "round_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performance_id", nullable = false)
    private Concert concert;

    // 공연이 시작하는 날짜
    @Column(name = "show_start_at", nullable = false)
    private LocalDateTime showStartAt;

    // 예매가 시작하는 날짜
    @Column(name = "reservation_start_at", nullable = false)
    private LocalDateTime reservationStartAt;
    // 예매가 끝나는 날짜
    @Column(name = "reservation_end_at", nullable = false)
    private LocalDateTime reservationEndAt;

    @Column(name = "seat_column_count", nullable = false)
    private Integer seatColumnCount;

    @Column(name = "seat_row_count", nullable = false)
    private Integer seatRowCount;
}
