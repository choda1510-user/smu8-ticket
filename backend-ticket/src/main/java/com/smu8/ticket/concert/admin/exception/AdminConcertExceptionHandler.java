package com.smu8.ticket.concert.admin.exception;

import com.smu8.ticket.http.response.ErrorCode;
import com.smu8.ticket.http.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AdminConcertExceptionHandler {

    @ExceptionHandler(InvalidConcertException.class)
    public ResponseEntity<ErrorResponse> handleInvalidConcert(
            InvalidConcertException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(
                        ErrorResponse.builder()
                                .code(ErrorCode.INVALID_CONCERT)
                                .message(exception.getMessage())
                                .build()
                );
    }
}