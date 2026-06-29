package com.smu8.ticket.concert.entity;

import com.smu8.ticket.venue.entity.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "concert")
public class Concert {
    @Id
    @Column(name = "performance_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String performanceCode;
    @Column(nullable = false)
    private String title;
    @Column
    private String performanceStatus;
    @Column
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;
    @Column
    private String runningTime;
    @Column
    private String notice;
    @Column
    private String cardPosterUrl;
    @Column
    private String screenPosterUrl;
    @Column
    private String descriptionPosterUrl;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST)
    private List<PerformanceSchedule> performanceSchedules = new LinkedList<>();

    @Builder.Default
    @OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST)
    private List<SeatGrade> seatGrades = new LinkedList<>();

    public void addPerformanceSchedule(PerformanceSchedule performanceSchedule) {
        performanceSchedules.add(performanceSchedule);
        performanceSchedule.setConcert(this);
    }
    public void addSeatGrade(SeatGrade seatGrade) {
        seatGrades.add(seatGrade);
        seatGrade.setConcert(this);
    }
}
