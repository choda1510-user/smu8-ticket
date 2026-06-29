package com.smu8.ticket.reservation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "cancel_reservation")
public class CancelReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancellation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "cancel_reason", nullable = false, columnDefinition = "text")
    private String cancelReason;

    @Column(name = "cancel_amount", nullable = false)
    private Integer cancelAmount;

    @Column(name = "cancel_status", nullable = false, length = 30)
    private String cancelStatus;

    @Column(name = "canceled_at", nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;
}
