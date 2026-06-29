package com.smu8.ticket.reservation.entity;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(name = "reservation_no", nullable = false, unique = true, length = 50)
    private String reservationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "user_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id", referencedColumnName = "round_id", nullable = false)
    private PerformanceSchedule performanceSchedule;

    @Column(name = "reservation_status", nullable = false, length = 30)
    private String reservationStatus;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @CreatedDate
    @Column(name = "reserved_at", nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.PERSIST)
    private List<ReservationSeat> reservationSeats = new LinkedList<>();

    @Builder.Default
    @OneToMany(mappedBy = "reservation")
    private List<CancelReservation> cancelReservations = new LinkedList<>();

    public void cancel(String reason) {
        this.reservationStatus = "CANCELED";
    }

    public void addReservationSeat(ReservationSeat reservationSeat) {
        reservationSeats.add(reservationSeat);
        reservationSeat.setReservation(this);
    }
}
