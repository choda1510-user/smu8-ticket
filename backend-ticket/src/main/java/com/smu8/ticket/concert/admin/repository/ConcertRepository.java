package com.smu8.ticket.concert.admin.repository;

import com.smu8.ticket.concert.entity.Concert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConcertRepository extends JpaRepository<Concert, Long> {
    List<Concert> id(Long id);
}
