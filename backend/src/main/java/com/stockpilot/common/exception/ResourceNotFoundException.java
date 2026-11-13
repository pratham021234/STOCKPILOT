package com.stockpilot.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource does not exist or does not belong to the tenant.
 */
public class ResourceNotFoundException extends BaseBusinessException {

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s with identifier '%s' was not found", resourceName, identifier),
                HttpStatus.NOT_FOUND,
                "RESOURCE_NOT_FOUND");
    }

    public ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
