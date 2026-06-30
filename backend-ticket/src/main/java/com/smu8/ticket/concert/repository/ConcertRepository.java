package com.smu8.ticket.concert.repository;

import com.smu8.ticket.concert.entity.Concert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
// 관리자 공연 목록에서 검색 조건과 예매 상태 조건을 DB 쿼리로 조합하기 위해 Specification 실행 기능을 추가합니다.
public interface ConcertRepository extends JpaRepository<Concert, Long>, JpaSpecificationExecutor<Concert> {
    Page<Concert> findAll(Pageable pageable);
}
