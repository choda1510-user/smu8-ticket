package com.smu8.ticket.concert.admin.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AdminConcertExceptionHandler {

    @ExceptionHandler(InvalidConcertException.class)
    public ResponseEntity<String> handleInvalidConcert(
            InvalidConcertException exception
    ) {
        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }
}