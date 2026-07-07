package com.smu8.waiting.service;

import com.smu8.waiting.entity.ConcertReservationTime;
import com.smu8.waiting.repository.ConcertReservationTimeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Component
@RequiredArgsConstructor
public class WaitingAdmissionScheduler {
    private final ConcertReservationTimeRepository concertReservationTimeRepository;
    private final WaitingAdmissionScriptExecutor waitingAdmissionScriptExecutor;

    @Value("${waiting.admission.enabled:true}")
    private boolean enabled;

    @Value("${waiting.admission.count-per-cycle:10}")
    private long countPerCycle;

    @Value("${waiting.admission.active-ttl-seconds:300}")
    private long activeTtlSeconds;

    @Scheduled(fixedDelayString = "${waiting.admission.fixed-delay-millis:1000}")
    public void admitWaitingAccounts() {
        if (!enabled) {
            return;
        }

        Duration activeTtl = Duration.ofSeconds(activeTtlSeconds);
        concertReservationTimeRepository.findAll().stream()
                .filter(this::isReservationOpen)
                .forEach((concertReservationTime) -> {
                    long admittedCount = waitingAdmissionScriptExecutor.admit(
                            concertReservationTime.getConcertId(),
                            countPerCycle,
                            activeTtl
                    );
                    if (admittedCount > 0) {
                        log.debug("Admitted waiting accounts. concertId={}, count={}",
                                concertReservationTime.getConcertId(), admittedCount);
                    }
                });
    }

    private boolean isReservationOpen(ConcertReservationTime concertReservationTime) {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        return !now.isBefore(concertReservationTime.getReservationStartDate())
                && !now.isAfter(concertReservationTime.getReservationLastEndDate());
    }
}
