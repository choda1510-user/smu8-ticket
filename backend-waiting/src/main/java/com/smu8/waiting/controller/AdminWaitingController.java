package com.smu8.waiting.controller;

import com.smu8.waiting.dto.command.DeleteConcertReservationTimeCommand;
import com.smu8.waiting.dto.query.ConcertReservationTimeQuery;
import com.smu8.waiting.http.request.SaveConcertReservationTimeRequest;
import com.smu8.waiting.http.response.ConcertReservationTimeResponse;
import com.smu8.waiting.http.response.WaitingCommandResponse;
import com.smu8.waiting.service.WaitingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/waiting/concerts")
public class AdminWaitingController {
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

}
