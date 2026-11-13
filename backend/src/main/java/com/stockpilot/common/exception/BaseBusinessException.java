package com.stockpilot.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Root domain/business exception class for the StockPilot application.
 */
@Getter
public class BaseBusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public BaseBusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
        this.errorCode = "BUSINESS_RULE_VIOLATION";
    }

    public BaseBusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public BaseBusinessException(String message, Throwable cause, HttpStatus status, String errorCode) {
        super(message, cause);
        this.status = status;
        this.errorCode = errorCode;
    }
}
