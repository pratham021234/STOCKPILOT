package com.stockpilot.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an incoming request is malformed or violates logical constraints.
 */
public class BadRequestException extends BaseBusinessException {

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "BAD_REQUEST");
    }

    public BadRequestException(String message, String errorCode) {
        super(message, HttpStatus.BAD_REQUEST, errorCode);
    }
}

