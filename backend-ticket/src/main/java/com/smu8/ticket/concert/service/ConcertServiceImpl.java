package com.smu8.ticket.concert.service;

import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.file.service.StorageService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ConcertServiceImpl implements ConcertService {
    private static final String CANCELED_STATUS = "\uacf5\uc5f0\ucde8\uc18c";

    private final ConcertRepository concertRepository;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query) {
        PageRequest pageRequest = PageRequest.of(
                query.pageQuery().page(),
                query.pageQuery().size()
        );
        List<String> concertSearchTerms = getConcertSearchTerms(query);

        if (!concertSearchTerms.isEmpty()) {
            return PageResult.from(concertRepository.findAll(
                            createUserConcertSearchSpecification(query, concertSearchTerms),
                            pageRequest)
                    .map((concert -> ConcertDetailResult.from(concert, storageService))));
        }

        if ("upcoming".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findUpcomingConcerts(
                            CANCELED_STATUS,
                            LocalDateTime.now(),
                            pageRequest
                    )
                    .map((concert -> ConcertDetailResult.from(concert, storageService))));
        }

        if ("open".equalsIgnoreCase(query.status())) {
            return PageResult.from(concertRepository
                    .findOpenConcerts(
                            CANCELED_STATUS,
                            LocalDateTime.now(),
                            pageRequest
                    )
                    .map((concert -> ConcertDetailResult.from(concert, storageService))));
        }

        return PageResult.from(concertRepository.findActiveConcerts(CANCELED_STATUS, pageRequest)
                .map((concert -> ConcertDetailResult.from(concert, storageService))));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()), storageService);
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }

    private Specification<Concert> createUserConcertSearchSpecification(
            ConcertPageQuery query,
            List<String> concertSearchTerms
    ) {
        LocalDateTime now = LocalDateTime.now();

        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.notEqual(root.<String>get("performanceStatus"), CANCELED_STATUS));

            for (String concertSearchTerm : concertSearchTerms) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.<String>get("title")),
                        "%" + concertSearchTerm.toLowerCase(Locale.ROOT) + "%"));
            }

            if ("upcoming".equalsIgnoreCase(query.status())) {
                Join<Concert, PerformanceSchedule> schedule = root.join("performanceSchedules");
                predicates.add(criteriaBuilder.greaterThan(
                        schedule.<LocalDateTime>get("reservationStartAt"),
                        now));
            }

            if ("open".equalsIgnoreCase(query.status())) {
                Join<Concert, PerformanceSchedule> schedule = root.join("performanceSchedules");
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        schedule.<LocalDateTime>get("reservationStartAt"),
                        now));
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        schedule.<LocalDateTime>get("reservationEndAt"),
                        now));
            }

            criteriaQuery.distinct(true);
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private List<String> getConcertSearchTerms(ConcertPageQuery query) {
        if (query.concertNames() == null || query.concertNames().isEmpty()) {
            return List.of();
        }

        return query.concertNames().stream()
                .filter(concertName -> concertName != null && !concertName.isBlank())
                .flatMap(concertName -> Arrays.stream(concertName.trim().split("\\s+")))
                .map(String::trim)
                .filter(concertName -> !concertName.isBlank())
                .toList();
    }
}
