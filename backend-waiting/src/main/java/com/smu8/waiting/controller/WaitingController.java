package com.smu8.waiting.controller;

import com.smu8.waiting.dto.command.EnterWaitingQueueCommand;
import com.smu8.waiting.dto.command.LeaveWaitingQueueCommand;
import com.smu8.waiting.dto.command.RemoveActiveAccountCommand;
import com.smu8.waiting.dto.query.ActiveAccountQuery;
import com.smu8.waiting.dto.query.WaitingQueueStatusQuery;
import com.smu8.waiting.http.response.ActiveAccountResponse;
import com.smu8.waiting.http.response.WaitingCommandResponse;
import com.smu8.waiting.http.response.WaitingQueueEntryResponse;
import com.smu8.waiting.http.response.WaitingQueueStatusResponse;
import com.smu8.waiting.service.WaitingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/waiting/concerts")
public class WaitingController {
    private final WaitingService waitingService;

    @PostMapping("/{concertId}/queue")
    public ResponseEntity<WaitingQueueEntryResponse> enterWaitingQueue(
            @PathVariable String concertId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(WaitingQueueEntryResponse.from(
                waitingService.enterWaitingQueue(EnterWaitingQueueCommand.from(concertId, authentication.getName()))));
    }

    @GetMapping("/{concertId}/queue")
    public ResponseEntity<WaitingQueueStatusResponse> getWaitingQueueStatus(
            @PathVariable String concertId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(WaitingQueueStatusResponse.from(
                waitingService.getWaitingQueueStatus(WaitingQueueStatusQuery.from(concertId, authentication.getName()))));
    }

    @DeleteMapping("/{concertId}/queue")
    public ResponseEntity<WaitingCommandResponse> leaveWaitingQueue(
            @PathVariable String concertId,
            Authentication authentication
    ) {
        waitingService.leaveWaitingQueue(LeaveWaitingQueueCommand.from(concertId, authentication.getName()));
        return ResponseEntity.ok(WaitingCommandResponse.ok());
    }

    @GetMapping("/{concertId}/active-accounts/self")
    public ResponseEntity<ActiveAccountResponse> getActiveAccount(
            @PathVariable String concertId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ActiveAccountResponse.from(
                waitingService.getActiveAccount(ActiveAccountQuery.from(concertId, authentication.getName()))));
    }

    @DeleteMapping("/{concertId}/active-accounts/self")
    public ResponseEntity<WaitingCommandResponse> removeActiveAccount(
            @PathVariable String concertId,
            Authentication authentication
    ) {
        waitingService.removeActiveAccount(RemoveActiveAccountCommand.from(concertId, authentication.getName()));
        return ResponseEntity.ok(WaitingCommandResponse.ok());
    }
}
