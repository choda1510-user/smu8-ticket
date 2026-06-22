package com.smu8.ticket.auth.exception;


import org.springframework.security.core.AuthenticationException;

public class RefreshTokenAuthenticationException extends AuthenticationException {

    public RefreshTokenAuthenticationException(String message) {
        super(message);
    }

    public RefreshTokenAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}