package com.smu8.ticket.account.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import com.smu8.ticket.reservation.entity.Reservation;
import lombok.*;
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
@Table(name = "account")
@EntityListeners(AuditingEntityListener.class)
public class Account {
    @Id
    @Column(name = "user_id", length = 36)
    private String id; // uuid
    @Column(unique = true)
    private String username;
    @Column
    private String password;
    @Column(unique = true)
    private String nickname;
    @Column(nullable = false)
    private boolean admin;
    @Column
    private String memberStatus;
    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;
    @Column(nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "account")
    private List<Reservation> reservations;
}
