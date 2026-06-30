package com.smu8.ticket.reservation.service;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import com.smu8.ticket.concert.repository.PerformanceScheduleRepository;
import com.smu8.ticket.concert.repository.SeatRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.reservation.dto.command.CreatePreemptReservationSeatCommand;
import com.smu8.ticket.reservation.dto.command.CreateReservationCommand;
import com.smu8.ticket.reservation.dto.command.RemovePreemptReservationSeatCommand;
import com.smu8.ticket.reservation.dto.query.ReservationConcertSeatFrameQuery;
import com.smu8.ticket.reservation.dto.query.ReservationPageQuery;
import com.smu8.ticket.reservation.dto.result.*;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import com.smu8.ticket.reservation.http.response.SeatStatus;
import com.smu8.ticket.reservation.repository.PreemptReservationSeatRepository;
import com.smu8.ticket.reservation.repository.ReservationRepository;
import com.smu8.ticket.reservation.repository.ReservationSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private static final String RESERVED_STATUS = "RESERVED";
    private static final String CANCELED_STATUS = "CANCELED";

    private final ReservationRepository reservationRepository;
    private final ReservationSeatRepository reservationSeatRepository;
    private final AccountRepository accountRepository;
    private final PerformanceScheduleRepository performanceScheduleRepository;
    private final SeatRepository seatRepository;
    private final PreemptReservationSeatRepository preemptReservationSeatRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResult<ReservationItemResult> getReservations(ReservationPageQuery query) {
        Page<Reservation> reservations = reservationRepository.findByAccountId(
                query.accountId(),
                PageRequest.of(query.pageQuery().page(), query.pageQuery().size())
        );

        return PageResult.from(reservations.map(ReservationItemResult::from));
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationDetailResult getReservation(Long reservationId, String accountId) {
        Reservation reservation = getOwnedReservation(reservationId, accountId);
        return ReservationDetailResult.from(
                reservation,
                reservationSeatRepository.findByReservationReservationId(reservationId).stream()
                        .map((reservationSeat) -> ReservationSeatDetailResult.from(reservationSeat, getSeatStatus(reservationSeat)))
                        .toList()
        );
    }

    @Override
    public ReservationConcertSeatFrameResult getReservationSeats(ReservationConcertSeatFrameQuery query) {
        PerformanceSchedule performanceSchedule = performanceScheduleRepository.findById(query.scheduleId()).orElseThrow();
        List<Seat> seats = seatRepository.findAllByPerformanceScheduleId(query.scheduleId());
        return ReservationConcertSeatFrameResult.from(performanceSchedule, seats.stream()
                .map((seat) -> ConcertSeatStatusResult.from(seat, getSeatStatus(seat)))
                .toList());
    }

    private SeatStatus getSeatStatus(ReservationSeat reservationSeat) {
        if (reservationSeatRepository.existsBySeatIdIn(List.of(reservationSeat.getSeat().getId()))) {
            return SeatStatus.UNAVAILABLE;
        }
        if (preemptReservationSeatRepository.existsPreempt(reservationSeat.getSeat().getId().toString())) {
            return SeatStatus.SELECTED;
        }
        return SeatStatus.AVAILABLE;
    }
    private SeatStatus getSeatStatus(Seat seat) {
        if (reservationSeatRepository.existsBySeatIdIn(List.of(seat.getId()))) {
            return SeatStatus.UNAVAILABLE;
        }
        if (preemptReservationSeatRepository.existsPreempt(seat.getId().toString())) {
            return SeatStatus.SELECTED;
        }
        return SeatStatus.AVAILABLE;
    }

    @Override
    @Transactional
    public void createPreemptReservationSeats(CreatePreemptReservationSeatCommand command) {
        validateCreatePreemptCommand(command);

        PerformanceSchedule schedule = performanceScheduleRepository.findById(command.scheduleId())
                .orElseThrow(() -> new IllegalArgumentException("Performance schedule was not found."));

        if (!schedule.getConcert().getId().equals(command.concertId())) {
            throw new IllegalArgumentException("Concert and schedule do not match.");
        }

        List<Seat> seats = seatRepository.findAllByIdInForUpdate(command.seatIds());
        validateSeats(command.scheduleId(), command.seatIds(), seats);
        validateSeatsNotReserved(command.seatIds());

        List<String> createdSeatIds = new java.util.ArrayList<>();
        try {
            for (Long seatId : command.seatIds()) {
                String redisSeatId = String.valueOf(seatId);
                boolean alreadyPreemptedByAccount = command.accountId()
                        .equals(preemptReservationSeatRepository.findOwnPreemptAccountId(redisSeatId));
                preemptReservationSeatRepository.createPreempt(redisSeatId, command.accountId());
                if (!alreadyPreemptedByAccount) {
                    createdSeatIds.add(redisSeatId);
                }
            }
        } catch (RuntimeException e) {
            createdSeatIds.forEach((seatId) ->
                    preemptReservationSeatRepository.removeOwnPreempt(seatId, command.accountId()));
            throw e;
        }
    }

    @Override
    @Transactional
    // 공연/회차/좌석 검증 후 현재 사용자가 잡은 선점만 해제한다.
    public void removePreemptReservationSeats(RemovePreemptReservationSeatCommand command) {
        validateRemovePreemptCommand(command);

        PerformanceSchedule schedule = performanceScheduleRepository.findById(command.scheduleId())
                .orElseThrow(() -> new IllegalArgumentException("Performance schedule was not found."));

        if (!schedule.getConcert().getId().equals(command.concertId())) {
            throw new IllegalArgumentException("Concert and schedule do not match.");
        }

        List<Seat> seats = seatRepository.findAllById(command.seatIds());
        validateSeats(command.scheduleId(), command.seatIds(), seats);

        command.seatIds().stream()
                .map(String::valueOf)
                .forEach((seatId) -> preemptReservationSeatRepository.removeOwnPreempt(seatId, command.accountId()));
    }

    @Override
    @Transactional
    public ReservationItemResult createReservation(CreateReservationCommand command) {
        validateCreateCommand(command);

        Account account = accountRepository.findById(command.accountId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        PerformanceSchedule schedule = performanceScheduleRepository.findById(command.scheduleId())
                .orElseThrow(() -> new IllegalArgumentException("공연 회차를 찾을 수 없습니다."));

        if (!schedule.getConcert().getId().equals(command.concertId())) {
            throw new IllegalArgumentException("공연과 회차 정보가 일치하지 않습니다.");
        }

        List<Seat> seats = seatRepository.findAllByIdInForUpdate(command.seatIds());

        if (seats.size() != command.seatIds().size()) {
            throw new IllegalArgumentException("존재하지 않는 좌석이 포함되어 있습니다.");
        }

        if (seats.stream().anyMatch((seat) -> !seat.getPerformanceSchedule().getId().equals(command.scheduleId()))) {
            throw new IllegalArgumentException("선택한 회차의 좌석만 예매할 수 있습니다.");
        }

        if (reservationSeatRepository.existsBySeatIdIn(command.seatIds())) {
            throw new IllegalStateException("이미 예매된 좌석이 포함되어 있습니다.");
        }

        validateSeatsPreemptedByAccount(command.accountId(), command.seatIds());

        Reservation reservation = Reservation.builder()
                .reservationNo(createReservationNo())
                .account(account)
                .performanceSchedule(schedule)
                .reservationStatus(RESERVED_STATUS)
                .totalQuantity(seats.size())
                .totalAmount(calculateTotalAmount(seats))
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        reservationSeatRepository.saveAll(seats.stream()
                .map((seat) -> ReservationSeat.builder()
                        .reservation(savedReservation)
                        .seat(seat)
                        .build())
                .toList());

        removePreemptReservationSeatsAfterCommit(command.accountId(), command.seatIds());

        return ReservationItemResult.from(savedReservation);
    }

    @Override
    @Transactional
    public ReservationItemResult cancelReservation(Long reservationId, String accountId) {
        Reservation reservation = getOwnedReservation(reservationId, accountId);

        if (CANCELED_STATUS.equals(reservation.getReservationStatus())) {
            throw new IllegalStateException("이미 취소된 예매입니다.");
        }

        reservation.cancel(CANCELED_STATUS);
        reservationSeatRepository.deleteByReservationReservationId(reservationId);

        return ReservationItemResult.from(reservation);
    }

    private Reservation getOwnedReservation(Long reservationId, String accountId) {
        return reservationRepository.findByReservationIdAndAccountId(reservationId, accountId)
                .orElseThrow(() -> new IllegalArgumentException("예매 정보를 찾을 수 없습니다."));
    }

    private void validateCreateCommand(CreateReservationCommand command) {
        if (command == null || command.accountId() == null || command.concertId() == null || command.scheduleId() == null) {
            throw new IllegalArgumentException("공연과 회차 정보가 필요합니다.");
        }

        if (command.seatIds() == null || command.seatIds().isEmpty()) {
            throw new IllegalArgumentException("좌석을 선택해주세요.");
        }
    }

    private void validateCreatePreemptCommand(CreatePreemptReservationSeatCommand command) {
        if (command == null || command.accountId() == null || command.concertId() == null || command.scheduleId() == null) {
            throw new IllegalArgumentException("Preempt reservation seat information is required.");
        }

        if (command.seatIds() == null || command.seatIds().isEmpty()) {
            throw new IllegalArgumentException("At least one seat is required.");
        }
    }

    // 선점 해제도 선점 생성과 같은 필수값을 요구한다.
    private void validateRemovePreemptCommand(RemovePreemptReservationSeatCommand command) {
        if (command == null || command.accountId() == null || command.concertId() == null || command.scheduleId() == null) {
            throw new IllegalArgumentException("Preempt reservation seat information is required.");
        }

        if (command.seatIds() == null || command.seatIds().isEmpty()) {
            throw new IllegalArgumentException("At least one seat is required.");
        }
    }

    private void validateSeats(Long scheduleId, List<Long> seatIds, List<Seat> seats) {
        if (seats.size() != seatIds.size()) {
            throw new IllegalArgumentException("Some seats do not exist.");
        }

        if (seats.stream().anyMatch((seat) -> !seat.getPerformanceSchedule().getId().equals(scheduleId))) {
            throw new IllegalArgumentException("Only seats in the selected schedule can be reserved.");
        }
    }

    private void validateSeatsNotReserved(List<Long> seatIds) {
        if (reservationSeatRepository.existsBySeatIdIn(seatIds)) {
            throw new IllegalStateException("Some seats are already reserved.");
        }
    }

    private void validateSeatsPreemptedByAccount(String accountId, List<Long> seatIds) {
        for (Long seatId : seatIds) {
            String preemptAccountId = preemptReservationSeatRepository.findOwnPreemptAccountId(String.valueOf(seatId));
            if (preemptAccountId == null || !preemptAccountId.equals(accountId)) {
                throw new IllegalStateException("Some seats are preempted by another account.");
            }
        }
    }

    private void removePreemptReservationSeatsAfterCommit(String accountId, List<Long> seatIds) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            removePreemptReservationSeats(accountId, seatIds);
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                removePreemptReservationSeats(accountId, seatIds);
            }
        });
    }

    private void removePreemptReservationSeats(String accountId, List<Long> seatIds) {
        seatIds.stream()
                .map(String::valueOf)
                .forEach((seatId) -> preemptReservationSeatRepository.removeOwnPreempt(seatId, accountId));
    }

    private String createReservationNo() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    private int calculateTotalAmount(List<Seat> seats) {
        return seats.stream()
                .map(Seat::getSeatGrade)
                .mapToInt(SeatGrade::getPrice)
                .sum();
    }
}
