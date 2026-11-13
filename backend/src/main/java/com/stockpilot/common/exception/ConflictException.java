package com.stockpilot.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an operation conflicts with existing entity state (e.g., duplicate unique keys).
 */
public class ConflictException extends BaseBusinessException {

    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT, "RESOURCE_CONFLICT");
    }

    public ConflictException(String resourceName, String field, Object value) {
        super(String.format("%s with %s '%s' already exists", resourceName, field, value),
                HttpStatus.CONFLICT,
                "RESOURCE_CONFLICT");
    }
}
