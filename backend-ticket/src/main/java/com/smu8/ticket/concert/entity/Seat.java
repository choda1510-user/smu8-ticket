package com.smu8.ticket.concert.entity;

import jakarta.persistence.*;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.LinkedList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "seat")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id")
    private PerformanceSchedule performanceSchedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_grade_id", nullable = false)
    private SeatGrade seatGrade;

    @Column(name = "row_index", nullable = false, length = 20)
    private Integer rowIndex;

    @Column(name = "column_index", nullable = false)
    private Integer columnIndex;

    @Builder.Default
    @OneToMany(mappedBy = "seat")
    private List<ReservationSeat> reservationSeats = new LinkedList<>();

    public void addReservationSeat(ReservationSeat reservationSeat) {
        reservationSeats.add(reservationSeat);
        reservationSeat.setSeat(this);
    }
    public void setPerformanceSchedule(PerformanceSchedule performanceSchedule) {
        this.performanceSchedule = performanceSchedule;
        performanceSchedule.getSeats().add(this);
    }
    public void setSeatGrade(SeatGrade seatGrade) {
        this.seatGrade.getSeats().remove(this);
        this.seatGrade = seatGrade;
        seatGrade.getSeats().add(this);
    }
}
