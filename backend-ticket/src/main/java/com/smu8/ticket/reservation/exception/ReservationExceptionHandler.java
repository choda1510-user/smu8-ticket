package com.smu8.ticket.reservation.exception;

import com.smu8.ticket.http.response.ErrorCode;
import com.smu8.ticket.http.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ReservationExceptionHandler {

    // 제한 초과는 요청 충돌 상황이므로 409와 안내 메시지를 내려 프론트가 이동을 막게 합니다.
    @ExceptionHandler(ReservationSeatLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleReservationSeatLimitExceeded(
            ReservationSeatLimitExceededException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        ErrorResponse.builder()
                                .code(ErrorCode.RESERVATION_SEAT_LIMIT_EXCEEDED)
                                .message(exception.getMessage())
                                .build()
                );
    }
}
