package com.smu8.waiting.service;

import com.smu8.waiting.dto.command.DeleteConcertReservationTimeCommand;
import com.smu8.waiting.dto.command.EnterWaitingQueueCommand;
import com.smu8.waiting.dto.command.LeaveWaitingQueueCommand;
import com.smu8.waiting.dto.command.RemoveActiveAccountCommand;
import com.smu8.waiting.dto.command.SaveConcertReservationTimeCommand;
import com.smu8.waiting.dto.query.ActiveAccountQuery;
import com.smu8.waiting.dto.query.ConcertReservationTimeQuery;
import com.smu8.waiting.dto.query.WaitingQueueStatusQuery;
import com.smu8.waiting.dto.result.ActiveAccountResult;
import com.smu8.waiting.dto.result.ConcertReservationTimeResult;
import com.smu8.waiting.dto.result.WaitingQueueEntryResult;
import com.smu8.waiting.dto.result.WaitingQueueStatusResult;
import com.smu8.waiting.entity.ConcertReservationTime;
import com.smu8.waiting.repository.ConcertReservationActiveAccountRepository;
import com.smu8.waiting.repository.ConcertReservationTimeRepository;
import com.smu8.waiting.repository.ConcertWaitingQueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class WaitingServiceImpl implements WaitingService {
    private final ConcertReservationTimeRepository concertReservationTimeRepository;
    private final ConcertWaitingQueueRepository concertWaitingQueueRepository;
    private final ConcertReservationActiveAccountRepository concertReservationActiveAccountRepository;

    @Override
    public ConcertReservationTimeResult saveConcertReservationTime(SaveConcertReservationTimeCommand command) {
        validateConcertId(command.concertId());

        if (command.reservationStartDate() == null || command.reservationLastEndDate() == null) {
            throw new IllegalArgumentException("Reservation time is required.");
        }

        if (command.reservationStartDate().isAfter(command.reservationLastEndDate())) {
            throw new IllegalArgumentException("Reservation start date must be before or equal to reservation end date.");
        }

        ConcertReservationTime concertReservationTime = ConcertReservationTime.builder()
                .concertId(command.concertId())
                .reservationStartDate(command.reservationStartDate())
                .reservationLastEndDate(command.reservationLastEndDate())
                .build();

        return ConcertReservationTimeResult.from(concertReservationTimeRepository.save(concertReservationTime));
    }

    @Override
    public ConcertReservationTimeResult getConcertReservationTime(ConcertReservationTimeQuery query) {
        return ConcertReservationTimeResult.from(getConcertReservationTimeOrThrow(query.concertId()));
    }

    @Override
    public void deleteConcertReservationTime(DeleteConcertReservationTimeCommand command) {
        validateConcertId(command.concertId());
        concertReservationTimeRepository.deleteByConcertId(command.concertId());
    }

    @Override
    public WaitingQueueEntryResult enterWaitingQueue(EnterWaitingQueueCommand command) {
        validateConcertId(command.concertId());
        validateAccountId(command.accountId());
        getConcertReservationTimeOrThrow(command.concertId());

        if (concertReservationActiveAccountRepository.contains(command.concertId(), command.accountId())) {
            return new WaitingQueueEntryResult(
                    command.concertId(),
                    command.accountId(),
                    false,
                    true,
                    null,
                    concertWaitingQueueRepository.count(command.concertId())
            );
        }

        boolean entered = concertWaitingQueueRepository.enqueue(
                command.concertId(),
                command.accountId(),
                System.currentTimeMillis()
        );

        Long rank = concertWaitingQueueRepository.findRank(command.concertId(), command.accountId())
                .map(this::toWaitingRank)
                .orElse(null);

        return new WaitingQueueEntryResult(
                command.concertId(),
                command.accountId(),
                entered,
                false,
                rank,
                concertWaitingQueueRepository.count(command.concertId())
        );
    }

    @Override
    public WaitingQueueStatusResult getWaitingQueueStatus(WaitingQueueStatusQuery query) {
        validateConcertId(query.concertId());
        validateAccountId(query.accountId());

        ConcertReservationTime concertReservationTime = getConcertReservationTimeOrThrow(query.concertId());
        boolean active = concertReservationActiveAccountRepository.contains(query.concertId(), query.accountId());
        Long rank = concertWaitingQueueRepository.findRank(query.concertId(), query.accountId())
                .map(this::toWaitingRank)
                .orElse(null);

        return new WaitingQueueStatusResult(
                query.concertId(),
                query.accountId(),
                active,
                rank != null,
                rank,
                concertWaitingQueueRepository.count(query.concertId()),
                isReservationOpen(concertReservationTime)
        );
    }

    @Override
    public ActiveAccountResult getActiveAccount(ActiveAccountQuery query) {
        validateConcertId(query.concertId());
        validateAccountId(query.accountId());

        return new ActiveAccountResult(
                query.concertId(),
                query.accountId(),
                concertReservationActiveAccountRepository.contains(query.concertId(), query.accountId())
        );
    }

    @Override
    public void leaveWaitingQueue(LeaveWaitingQueueCommand command) {
        validateConcertId(command.concertId());
        validateAccountId(command.accountId());
        concertWaitingQueueRepository.remove(command.concertId(), command.accountId());
    }

    @Override
    public void removeActiveAccount(RemoveActiveAccountCommand command) {
        validateConcertId(command.concertId());
        validateAccountId(command.accountId());
        concertReservationActiveAccountRepository.remove(command.concertId(), command.accountId());
    }

    private ConcertReservationTime getConcertReservationTimeOrThrow(String concertId) {
        validateConcertId(concertId);
        return concertReservationTimeRepository.findByConcertId(concertId)
                .orElseThrow(() -> new IllegalArgumentException("Concert reservation time was not found."));
    }

    private boolean isReservationOpen(ConcertReservationTime concertReservationTime) {
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(concertReservationTime.getReservationStartDate())
                && !now.isAfter(concertReservationTime.getReservationLastEndDate());
    }

    private long toWaitingRank(long redisRank) {
        return redisRank + 1;
    }

    private void validateConcertId(String concertId) {
        if (concertId == null || concertId.isBlank()) {
            throw new IllegalArgumentException("Concert id is required.");
        }
    }

    private void validateAccountId(String accountId) {
        if (accountId == null || accountId.isBlank()) {
            throw new IllegalArgumentException("Account id is required.");
        }
    }
}
