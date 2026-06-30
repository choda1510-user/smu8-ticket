package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.command.*;
import com.smu8.ticket.concert.admin.exception.InvalidConcertException;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.file.service.StorageService;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminConcertServiceImpl implements AdminConcertService {
    private final ConcertRepository concertRepository;
    private final StorageService storageService;
    private final VenueRepository venueRepository;

    @Transactional
    @Override
    public ConcertDetailResult createConcert(CreateConcertCommand command) {
        validateCreateConcert(command);

        Venue venue = getVenueById(command.venueId());

        String cardPosterKey=null;
        String bannerPosterKey=null;
        String descriptionPosterKey=null;

        try{
            cardPosterKey = storageService.store(command.cardPoster());
            bannerPosterKey = storageService.store(command.bannerPoster());
            descriptionPosterKey = storageService.store(command.descriptionPoster());
            Concert concert = command.toEntity(
                    venue,
                    storageService.getUrl(cardPosterKey),
                    storageService.getUrl(bannerPosterKey),
                    storageService.getUrl(descriptionPosterKey)
            );
            Concert savedConcert = concertRepository.saveAndFlush(concert);
            return ConcertDetailResult.from(savedConcert);

        } catch (RuntimeException exception) {
            deleteStoredFile(descriptionPosterKey, exception);
            deleteStoredFile(bannerPosterKey, exception);
            deleteStoredFile(cardPosterKey, exception);
            throw exception;
        }
    }


    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query) {
//        return concertRepository.findAll().stream()
//                .map(ConcertDetailResult::from)
//                .toList();
        // 전체 조회 후 프론트에서 거르지 않도록, 검색 조건을 DB 쿼리에 직접 적용합니다.
        return PageResult.from(concertRepository.findAll(
                        createAdminConcertSpecification(query),
                        PageRequest.of(query.pageQuery().page(), query.pageQuery().size()))
                .map(ConcertDetailResult::from));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()));
    }


    @Override
    @Transactional
    public ConcertDetailResult updateConcert(UpdateConcertCommand command) {
        Concert concert = getById(command.id());
        Venue venue = getVenueById(command.venueId());
        command.update(concert, venue);
        return ConcertDetailResult.from(concert);
    }

    @Override
    public void deleteConcert(Long id) {
        concertRepository.delete(getById(id));
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }

    // 관리자 공연 목록의 검색 조건들이 선택값이라 필요한 조건만 동적으로 조합합니다.
    private Specification<Concert> createAdminConcertSpecification(ConcertPageQuery query) {
        LocalDateTime now = LocalDateTime.now();

        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query.concertNames() != null && !query.concertNames().isEmpty()) {
                // 공연명 검색은 여러 키워드 중 하나라도 포함되면 조회되도록 OR 조건으로 묶습니다.
                List<Predicate> concertNamePredicates = query.concertNames().stream()
                        .map(String::trim)
                        .filter(concertName -> !concertName.isBlank())
                        .map(concertName -> criteriaBuilder.like(
                                criteriaBuilder.lower(root.<String>get("title")),
                                "%" + concertName.toLowerCase(Locale.ROOT) + "%"))
                        .toList();

                if (!concertNamePredicates.isEmpty()) {
                    predicates.add(criteriaBuilder.or(concertNamePredicates.toArray(Predicate[]::new)));
                }
            }

            if (query.venueNames() != null && !query.venueNames().isBlank()) {
                // 공연장명 검색도 DB에서 처리해 운영 페이지가 큰 목록을 직접 필터링하지 않게 합니다.
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.join("venue").<String>get("name")),
                        "%" + query.venueNames().trim().toLowerCase(Locale.ROOT) + "%"));
            }

            if (query.venueCode() != null && !query.venueCode().isBlank()) {
                try {
                    // 프론트의 공연장코드는 현재 venueId로 쓰고 있어 숫자로 변환해 비교합니다.
                    Long venueId = Long.parseLong(query.venueCode().trim());
                    predicates.add(criteriaBuilder.equal(root.join("venue").<Long>get("id"), venueId));
                } catch (NumberFormatException ignored) {
                    // 숫자가 아닌 공연장코드는 매칭될 수 없으므로 빈 결과가 나오도록 false 조건을 추가합니다.
                    predicates.add(criteriaBuilder.disjunction());
                }
            }

            if (query.status() != null && !query.status().isBlank()) {
                // 예매 상태는 공연 자체가 아니라 회차의 예매 시작/종료 시간으로 판단해야 해서 회차를 조인합니다.
                predicates.add(createStatusPredicate(
                        root,
                        root.join("performanceSchedules"),
                        query.status(),
                        now,
                        criteriaBuilder));
            }

            // 회차 조인으로 같은 공연이 여러 번 조회될 수 있어 공연 기준으로 중복을 제거합니다.
            criteriaQuery.distinct(true);
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    // 운영 페이지의 OPEN/BEFORE_OPEN/CLOSED 상태를 DB에서 비교할 수 있는 시간 조건으로 바꿉니다.
    private Predicate createStatusPredicate(
            Root<Concert> root,
            Join<Concert, PerformanceSchedule> schedule,
            String status,
            LocalDateTime now,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder
    ) {
        String normalizedStatus = status.trim().toUpperCase(Locale.ROOT);

        return switch (normalizedStatus) {
            // 예매 시작 이후이고 예매 종료 전인 회차가 있으면 예매진행중으로 조회합니다.
            case "OPEN" -> criteriaBuilder.and(
                    criteriaBuilder.lessThanOrEqualTo(schedule.<LocalDateTime>get("reservationStartAt"), now),
                    criteriaBuilder.greaterThanOrEqualTo(schedule.<LocalDateTime>get("reservationEndAt"), now));
            // 예매 시작 시간이 아직 오지 않은 회차가 있으면 오픈대기중으로 조회합니다.
            case "BEFORE_OPEN" -> criteriaBuilder.greaterThan(schedule.<LocalDateTime>get("reservationStartAt"), now);
            // 예매 종료 시간이 지난 회차는 종료된 공연으로 조회할 수 있게 둡니다.
            case "CLOSED" -> criteriaBuilder.lessThan(schedule.<LocalDateTime>get("reservationEndAt"), now);
            // 시간 기반 상태가 아닌 값은 기존 공연 상태 컬럼 기준으로 조회합니다.
            default -> criteriaBuilder.equal(root.<String>get("performanceStatus"), normalizedStatus);
        };
    }

    private Venue getVenueById(Long venueId) {
        return venueRepository.findById(venueId)
                .orElseThrow(() -> new InvalidConcertException("존재하지 않는 공연장입니다."));
    }

    private void deleteStoredFile(String fileKey, RuntimeException originalException) {
        if (fileKey == null) {
            return;
        }

        try {
            storageService.delete(fileKey);
        } catch (RuntimeException deleteException) {
            originalException.addSuppressed(deleteException);
        }
    }

    private void validateCreateConcert(CreateConcertCommand command){
        if (command.title()==null || command.title().isBlank()){
            throw new InvalidConcertException("공연 제목은 필수입니다.");
        }
        if (command.venueId()==null){
            throw new InvalidConcertException("공연장을 선택해야합니다.");
        }
        if (command.startReservationAt()==null){
            throw new InvalidConcertException("예매 시작일시는 필수입니다.");
        }
        if (command.schedules()==null||command.schedules().isEmpty()){
            throw new InvalidConcertException("공연 회차는 하나 이상이어야 합니다.");
        }
        if (command.seatGrades()==null||command.seatGrades().isEmpty()){
            throw new InvalidConcertException("좌석 등급은 하나 이상이어야 합니다.");
        }
        if (command.cardPoster()==null || command.cardPoster().isEmpty()){
            throw new InvalidConcertException("카드 포스터는 필수입니다.");
        }
        if (command.bannerPoster() == null || command.bannerPoster().isEmpty()){
            throw new InvalidConcertException("배너 포스터는 필수입니다.");
        }
        if (command.descriptionPoster() == null || command.descriptionPoster().isEmpty()){
            throw new InvalidConcertException("상세 포스터는 필수입니다.");
        }

        Set<String> seatGradeNames = new HashSet<>();
        for (CreateSeatGradeCommand grade : command.seatGrades()){
            if (grade.gradeName() == null || grade.gradeName().isBlank()){
                throw new InvalidConcertException("좌석 등급 이름은 필수입니다.");
            }
            if (grade.price() == null || grade.price() < 0){
                throw new InvalidConcertException("좌석 가격은 0원 이상이어야합니다.");
            }
            if (!seatGradeNames.add(grade.gradeName())){
                throw new InvalidConcertException("같은 좌석 등급 이름을 중복해서 등록할 수 없습니다.");
            }
        }

        LocalDateTime now = LocalDateTime.now();
        Set<LocalDateTime> scheduleDates = new HashSet<>();
        for (CreatePerformanceScheduleCommand schedule : command.schedules()){
            if (schedule.date()==null){
                throw new InvalidConcertException("공연 시작일시는 필수입니다.");
            }
            if (schedule.date().isBefore(now)){
                throw new InvalidConcertException("공연 시작일시는 현재보다 이후여야 합니다.");
            }
            if (!scheduleDates.add(schedule.date())){
                throw new InvalidConcertException("같은 공연 시작일시를 중복해서 등록할 수 없습니다.");
            }
            if (schedule.reservationEndAt()==null){
                throw new InvalidConcertException("예매 종료일시는 필수입니다.");
            }
            if (!command.startReservationAt()
                    .isBefore(schedule.reservationEndAt())) {
                throw new InvalidConcertException("예매 시작일시는 예매 종료일시보다 이전이어야 합니다.");
            }
            if (!schedule.reservationEndAt().isBefore(schedule.date())){
                throw new InvalidConcertException("예매 종료일시는 공연 시작일시보다 이전이어야 합니다.");
            }
            if (schedule.rowMax()== null|| schedule.rowMax() <= 0 || schedule.rowMax()>1000){
                throw new InvalidConcertException("좌석 행 개수는 1개 이상 1000개 이하여야합니다.");
            }
            if (schedule.colMax()==null|| schedule.colMax() <=0 || schedule.colMax()>1000){
                throw new InvalidConcertException("좌석의 열개수는 1개 이상 1000개 이하여야합니다.");
            }
            if (schedule.seats() == null || schedule.seats().isEmpty()){
                throw new InvalidConcertException("좌석은 하나 이상이어야 합니다.");
            }

            Set<String> seatPositions = new HashSet<>();
            for (CreateSeatCommand seat : schedule.seats()){
                if (seat.row() == null || seat.col() == null){
                    throw new InvalidConcertException("좌석의 행과 열은 필수입니다.");
                }
                if (seat.row() < 1 || seat.row() > schedule.rowMax()
                        || seat.col() < 1 || seat.col() > schedule.colMax()){
                    throw new InvalidConcertException("좌석 위치가 지정된 행과 열의 범위를 벗어났습니다.");
                }
                if (seat.seatGradeName() == null || seat.seatGradeName().isBlank()){
                    throw new InvalidConcertException("좌석 등급 이름은 필수입니다.");
                }
                if (!seatGradeNames.contains(seat.seatGradeName())){
                    throw new InvalidConcertException("등록되지 않은 좌석 등급입니다: " + seat.seatGradeName());
                }

                String seatPosition = seat.row() + ":" + seat.col();
                if (!seatPositions.add(seatPosition)){
                    throw new InvalidConcertException("같은 위치의 좌석을 중복해서 등록할 수 없습니다.");
                }
            }
        }
    }
}
