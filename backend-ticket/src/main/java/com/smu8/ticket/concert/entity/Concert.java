package com.smu8.ticket.concert.entity;

import com.smu8.ticket.venue.entity.Venue;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
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
    @Column(nullable = false)
    private String performanceStatus;
    @Column (columnDefinition = "text")
    private String description ;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;
    @Column
    private String runningTime;
    @Column (columnDefinition = "text")
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

    @OneToMany(mappedBy = "concert")
    private List<PerformanceSchedule> performanceSchedules;

    @OneToMany(mappedBy = "concert")
    private List<SeatGrade> seatGrades;
}
