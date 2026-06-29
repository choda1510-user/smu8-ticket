package com.smu8.ticket.reservation.service;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import com.smu8.ticket.concert.repository.PerformanceScheduleRepository;
import com.smu8.ticket.concert.repository.SeatRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.reservation.dto.command.CreateReservationCommand;
import com.smu8.ticket.reservation.dto.query.ReservationPageQuery;
import com.smu8.ticket.reservation.dto.result.ReservationDetailResult;
import com.smu8.ticket.reservation.dto.result.ReservationItemResult;
import com.smu8.ticket.reservation.entity.Reservation;
import com.smu8.ticket.reservation.entity.ReservationSeat;
import com.smu8.ticket.reservation.repository.ReservationRepository;
import com.smu8.ticket.reservation.repository.ReservationSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                reservationSeatRepository.findByReservationReservationId(reservationId)
        );
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
