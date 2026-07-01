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
import com.smu8.ticket.waiting.event.ConcertWaitingRegistrationEvent;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import com.smu8.ticket.concert.repository.PerformanceScheduleRepository;
import com.smu8.ticket.concert.repository.SeatGradeRepository;
import com.smu8.ticket.concert.repository.SeatRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminConcertServiceImpl implements AdminConcertService {
    private final ConcertRepository concertRepository;
    private final StorageService storageService;
    private final VenueRepository venueRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final SeatGradeRepository seatGradeRepository;
    private final SeatRepository seatRepository;
    private final ApplicationEventPublisher eventPublisher;

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
                    cardPosterKey,
                    bannerPosterKey,
                    descriptionPosterKey
            );
            Concert savedConcert = concertRepository.saveAndFlush(concert);
            publishConcertWaitingRegistrationEvent(savedConcert, command.startReservationAt());
            return ConcertDetailResult.from(savedConcert, storageService);

        } catch (RuntimeException exception) {
            deleteStoredFile(descriptionPosterKey, exception);
            deleteStoredFile(bannerPosterKey, exception);
            deleteStoredFile(cardPosterKey, exception);
            throw exception;
        }
    }

    private void publishConcertWaitingRegistrationEvent(Concert concert, LocalDateTime reservationStartAt) {
        LocalDateTime reservationLastEndAt = concert.getPerformanceSchedules().stream()
                .map(PerformanceSchedule::getReservationEndAt)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .orElseThrow(() -> new InvalidConcertException("Reservation end date is required."));

        eventPublisher.publishEvent(new ConcertWaitingRegistrationEvent(
                String.valueOf(concert.getId()),
                reservationStartAt,
                reservationLastEndAt
        ));
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
                .map((concert -> ConcertDetailResult.from(concert, storageService))));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()), storageService);
    }


    @Override
    @Transactional
    public ConcertDetailResult updateConcert(UpdateConcertCommand command) {
        Concert concert = getById(command.id());
        Venue venue = getVenueById(command.venueId());
        command.update(concert, venue);
        return ConcertDetailResult.from(concert, storageService);
    }

    @Override
    @Transactional
    public ConcertDetailResult updateConcertBasicInfo(UpdateConcertBasicInfoCommand command) {
        Concert concert = getById(command.id());
        command.update(concert);

        if (command.schedules() != null) {
            syncSchedules(concert, command);
        }

        if (command.seatGrades() != null) {
            syncSeatGrades(concert, command.seatGrades());
        }

        String newCardPosterKey = null;
        String newBannerPosterKey = null;
        String newDescriptionPosterKey = null;

        try {
            if (command.hasNewCardPoster()) {
                String oldCardPosterKey = concert.getCardPosterId();
                newCardPosterKey = storageService.store(command.cardPoster());
                concert.setCardPosterId(newCardPosterKey);
                if (oldCardPosterKey != null) {
                    storageService.delete(oldCardPosterKey);
                }
            }
            if (command.hasNewBannerPoster()) {
                String oldBannerPosterKey = concert.getScreenPosterId();
                newBannerPosterKey = storageService.store(command.bannerPoster());
                concert.setScreenPosterId(newBannerPosterKey);
                if (oldBannerPosterKey != null) {
                    storageService.delete(oldBannerPosterKey);
                }
            }
            if (command.hasNewDescriptionPoster()) {
                String oldDescriptionPosterKey = concert.getDescriptionPosterId();
                newDescriptionPosterKey = storageService.store(command.descriptionPoster());
                concert.setDescriptionPosterId(newDescriptionPosterKey);
                if (oldDescriptionPosterKey != null) {
                    storageService.delete(oldDescriptionPosterKey);
                }
            }

            return ConcertDetailResult.from(concert, storageService);
        } catch (RuntimeException exception) {
            deleteStoredFile(newDescriptionPosterKey, exception);
            deleteStoredFile(newBannerPosterKey, exception);
            deleteStoredFile(newCardPosterKey, exception);
            throw exception;
        }
    }

    private void syncSchedules(Concert concert, UpdateConcertBasicInfoCommand command) {
        List<UpdateScheduleCommand> requestedSchedules = command.schedules();
        Set<Long> keepIds = requestedSchedules.stream()
                .map(UpdateScheduleCommand::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<PerformanceSchedule> toRemove = concert.getPerformanceSchedules().stream()
                .filter(schedule -> !keepIds.contains(schedule.getId()))
                .toList();

        for (PerformanceSchedule schedule : toRemove) {
            if (!schedule.getReservations().isEmpty()) {
                throw new InvalidConcertException(
                        "이미 예약이 존재하는 회차는 삭제할 수 없습니다. (회차 ID: " + schedule.getId() + ")");
            }
        }
        concert.getPerformanceSchedules().removeAll(toRemove);
        performanceScheduleRepository.deleteAll(toRemove);

        LocalDateTime reservationStartAt = concert.getPerformanceSchedules().stream()
                .map(PerformanceSchedule::getReservationStartAt)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(LocalDateTime.now());

        Integer rowMax = command.rowMax();
        Integer colMax = command.colMax();

        for (UpdateScheduleCommand scheduleCommand : requestedSchedules) {
            if (scheduleCommand.id() != null) {
                PerformanceSchedule existing = concert.getPerformanceSchedules().stream()
                        .filter(schedule -> schedule.getId().equals(scheduleCommand.id()))
                        .findFirst()
                        .orElseThrow(() -> new InvalidConcertException(
                                "존재하지 않는 회차입니다. (회차 ID: " + scheduleCommand.id() + ")"));
                existing.setShowStartAt(scheduleCommand.date());
                existing.setReservationEndAt(scheduleCommand.reservationEndAt());

                if (command.seats() != null && rowMax != null && colMax != null) {
                    updateExistingScheduleSeats(existing, concert, command.seats(), rowMax, colMax);
                }
            } else {
                PerformanceSchedule newSchedule = PerformanceSchedule.builder()
                        .concert(concert)
                        .showStartAt(scheduleCommand.date())
                        .reservationStartAt(reservationStartAt)
                        .reservationEndAt(scheduleCommand.reservationEndAt())
                        .seatRowCount(rowMax)
                        .seatColumnCount(colMax)
                        .build();
                concert.getPerformanceSchedules().add(newSchedule);

                if (command.seats() != null && rowMax != null && colMax != null) {
                    addSeatsToSchedule(newSchedule, concert, command.seats());
                }
            }
        }
    }

    private void addSeatsToSchedule(PerformanceSchedule schedule, Concert concert, List<UpdateSeatCommand> seatCommands) {
        Map<String, SeatGrade> seatGradeByName = concert.getSeatGrades().stream()
                .collect(Collectors.toMap(SeatGrade::getGradeName, Function.identity(), (a, b) -> a));

        for (UpdateSeatCommand seatCommand : seatCommands) {
            SeatGrade seatGrade = seatGradeByName.get(seatCommand.seatGradeName());
            if (seatGrade == null) {
                continue;
            }
            Seat seat = Seat.builder()
                    .performanceSchedule(schedule)
                    .seatGrade(seatGrade)
                    .rowIndex(seatCommand.row())
                    .columnIndex(seatCommand.col())
                    .build();
            schedule.getSeats().add(seat);
            seatGrade.getSeats().add(seat);
        }
    }

    private void updateExistingScheduleSeats(
            PerformanceSchedule schedule,
            Concert concert,
            List<UpdateSeatCommand> seatCommands,
            Integer rowMax,
            Integer colMax
    ) {
        Map<String, SeatGrade> seatGradeByName = concert.getSeatGrades().stream()
                .collect(Collectors.toMap(SeatGrade::getGradeName, Function.identity(), (a, b) -> a));

        Map<String, UpdateSeatCommand> requestedByPosition = seatCommands.stream()
                .collect(Collectors.toMap(
                        seatCommand -> seatCommand.row() + ":" + seatCommand.col(),
                        Function.identity(),
                        (a, b) -> a));

        Map<String, Seat> existingByPosition = schedule.getSeats().stream()
                .collect(Collectors.toMap(
                        seat -> seat.getRowIndex() + ":" + seat.getColumnIndex(),
                        Function.identity(),
                        (a, b) -> a));

        List<Seat> seatsToRemove = schedule.getSeats().stream()
                .filter(seat -> !requestedByPosition.containsKey(seat.getRowIndex() + ":" + seat.getColumnIndex()))
                .toList();

        for (Seat seat : seatsToRemove) {
            if (!seat.getReservationSeats().isEmpty()) {
                throw new InvalidConcertException(
                        "이미 예약된 좌석은 삭제할 수 없습니다. (행: " + seat.getRowIndex() + ", 열: " + seat.getColumnIndex() + ")");
            }
        }
        schedule.getSeats().removeAll(seatsToRemove);
        seatRepository.deleteAll(seatsToRemove);

        for (UpdateSeatCommand seatCommand : seatCommands) {
            String position = seatCommand.row() + ":" + seatCommand.col();
            Seat existingSeat = existingByPosition.get(position);
            SeatGrade seatGrade = seatGradeByName.get(seatCommand.seatGradeName());

            if (existingSeat != null) {
                if (seatGrade != null && !seatGrade.equals(existingSeat.getSeatGrade())) {
                    if (!existingSeat.getReservationSeats().isEmpty()) {
                        throw new InvalidConcertException(
                                "이미 예약된 좌석의 등급은 변경할 수 없습니다. (행: " + seatCommand.row() + ", 열: " + seatCommand.col() + ")");
                    }
                    existingSeat.setSeatGrade(seatGrade);
                }
            } else if (seatGrade != null) {
                Seat newSeat = Seat.builder()
                        .performanceSchedule(schedule)
                        .seatGrade(seatGrade)
                        .rowIndex(seatCommand.row())
                        .columnIndex(seatCommand.col())
                        .build();
                schedule.getSeats().add(newSeat);
                seatGrade.getSeats().add(newSeat);
            }
        }

        schedule.setSeatRowCount(rowMax);
        schedule.setSeatColumnCount(colMax);
    }

    private void syncSeatGrades(Concert concert, List<UpdateSeatGradeCommand> requestedSeatGrades) {
        Set<Long> keepIds = requestedSeatGrades.stream()
                .map(UpdateSeatGradeCommand::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<SeatGrade> toRemove = concert.getSeatGrades().stream()
                .filter(seatGrade -> !keepIds.contains(seatGrade.getId()))
                .toList();

        for (SeatGrade seatGrade : toRemove) {
            boolean hasReservedSeat = seatGrade.getSeats().stream()
                    .anyMatch(seat -> !seat.getReservationSeats().isEmpty());
            if (hasReservedSeat) {
                throw new InvalidConcertException(
                        "이미 예약이 존재하는 좌석등급은 삭제할 수 없습니다. (등급명: " + seatGrade.getGradeName() + ")");
            }
        }
        concert.getSeatGrades().removeAll(toRemove);
        seatGradeRepository.deleteAll(toRemove);

        for (UpdateSeatGradeCommand seatGradeCommand : requestedSeatGrades) {
            if (seatGradeCommand.id() != null) {
                SeatGrade existing = concert.getSeatGrades().stream()
                        .filter(seatGrade -> seatGrade.getId().equals(seatGradeCommand.id()))
                        .findFirst()
                        .orElseThrow(() -> new InvalidConcertException(
                                "존재하지 않는 좌석등급입니다. (등급 ID: " + seatGradeCommand.id() + ")"));
                existing.setGradeName(seatGradeCommand.gradeName());
                existing.setPrice(seatGradeCommand.price());
                existing.setColor(seatGradeCommand.color());
            } else {
                SeatGrade newSeatGrade = SeatGrade.builder()
                        .gradeName(seatGradeCommand.gradeName())
                        .price(seatGradeCommand.price())
                        .color(seatGradeCommand.color())
                        .build();
                concert.addSeatGrade(newSeatGrade);
            }
        }
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
