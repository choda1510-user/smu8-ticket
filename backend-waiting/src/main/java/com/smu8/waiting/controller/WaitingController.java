package com.smu8.waiting.controller;

import com.smu8.waiting.dto.command.DeleteConcertReservationTimeCommand;
import com.smu8.waiting.dto.command.LeaveWaitingQueueCommand;
import com.smu8.waiting.dto.command.RemoveActiveAccountCommand;
import com.smu8.waiting.dto.query.ActiveAccountQuery;
import com.smu8.waiting.dto.query.ConcertReservationTimeQuery;
import com.smu8.waiting.dto.query.WaitingQueueStatusQuery;
import com.smu8.waiting.http.request.EnterWaitingQueueRequest;
import com.smu8.waiting.http.request.SaveConcertReservationTimeRequest;
import com.smu8.waiting.http.response.ActiveAccountResponse;
import com.smu8.waiting.http.response.ConcertReservationTimeResponse;
import com.smu8.waiting.http.response.WaitingCommandResponse;
import com.smu8.waiting.http.response.WaitingQueueEntryResponse;
import com.smu8.waiting.http.response.WaitingQueueStatusResponse;
import com.smu8.waiting.service.WaitingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/waiting/concerts")
public class WaitingController {
    private final WaitingService waitingService;

    @PostMapping("/{concertId}/reservation-time")
    public ResponseEntity<ConcertReservationTimeResponse> saveConcertReservationTime(
            @PathVariable String concertId,
            @RequestBody SaveConcertReservationTimeRequest request
    ) {
        return ResponseEntity.ok(ConcertReservationTimeResponse.from(
                waitingService.saveConcertReservationTime(request.toCommand(concertId))));
    }

    @GetMapping("/{concertId}/reservation-time")
    public ResponseEntity<ConcertReservationTimeResponse> getConcertReservationTime(
            @PathVariable String concertId
    ) {
        return ResponseEntity.ok(ConcertReservationTimeResponse.from(
                waitingService.getConcertReservationTime(new ConcertReservationTimeQuery(concertId))));
    }

    @DeleteMapping("/{concertId}/reservation-time")
    public ResponseEntity<WaitingCommandResponse> deleteConcertReservationTime(
            @PathVariable String concertId
    ) {
        waitingService.deleteConcertReservationTime(new DeleteConcertReservationTimeCommand(concertId));
        return ResponseEntity.ok(WaitingCommandResponse.ok());
    }

    @PostMapping("/{concertId}/queue")
    public ResponseEntity<WaitingQueueEntryResponse> enterWaitingQueue(
            @PathVariable String concertId,
            @RequestBody EnterWaitingQueueRequest request
    ) {
        return ResponseEntity.ok(WaitingQueueEntryResponse.from(
                waitingService.enterWaitingQueue(request.toCommand(concertId))));
    }

    @GetMapping("/{concertId}/queue/{accountId}")
    public ResponseEntity<WaitingQueueStatusResponse> getWaitingQueueStatus(
            @PathVariable String concertId,
            @PathVariable String accountId
    ) {
        return ResponseEntity.ok(WaitingQueueStatusResponse.from(
                waitingService.getWaitingQueueStatus(new WaitingQueueStatusQuery(concertId, accountId))));
    }

    @DeleteMapping("/{concertId}/queue/{accountId}")
    public ResponseEntity<WaitingCommandResponse> leaveWaitingQueue(
            @PathVariable String concertId,
            @PathVariable String accountId
    ) {
        waitingService.leaveWaitingQueue(new LeaveWaitingQueueCommand(concertId, accountId));
        return ResponseEntity.ok(WaitingCommandResponse.ok());
    }

    @GetMapping("/{concertId}/active-accounts/{accountId}")
    public ResponseEntity<ActiveAccountResponse> getActiveAccount(
            @PathVariable String concertId,
            @PathVariable String accountId
    ) {
        return ResponseEntity.ok(ActiveAccountResponse.from(
                waitingService.getActiveAccount(new ActiveAccountQuery(concertId, accountId))));
    }

    @DeleteMapping("/{concertId}/active-accounts/{accountId}")
    public ResponseEntity<WaitingCommandResponse> removeActiveAccount(
            @PathVariable String concertId,
            @PathVariable String accountId
    ) {
        waitingService.removeActiveAccount(new RemoveActiveAccountCommand(concertId, accountId));
        return ResponseEntity.ok(WaitingCommandResponse.ok());
    }
}
