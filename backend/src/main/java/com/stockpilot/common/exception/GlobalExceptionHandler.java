package com.stockpilot.common.exception;

import com.stockpilot.common.api.ApiError;
import com.stockpilot.common.api.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;

/**
 * Centralized exception handler for all StockPilot REST controllers.
 * Ensures consistent ApiResponse wrapping, proper HTTP status codes, and structured error reporting.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        log.warn("Input validation failed: {}", ex.getMessage());
        List<ApiError> errors = new ArrayList<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.add(ApiError.of(
                    fieldError.getField(),
                    fieldError.getRejectedValue(),
                    fieldError.getDefaultMessage(),
                    "VALIDATION_ERROR"
            ));
        }

        ApiResponse<Void> response = ApiResponse.failure("Validation failed for input arguments", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(ConstraintViolationException ex) {
        log.warn("Constraint violation: {}", ex.getMessage());
        List<ApiError> errors = ex.getConstraintViolations().stream()
                .map(cv -> ApiError.of(
                        cv.getPropertyPath().toString(),
                        cv.getInvalidValue(),
                        cv.getMessage(),
                        "CONSTRAINT_VIOLATION"
                ))
                .toList();

        ApiResponse<Void> response = ApiResponse.failure("Constraint violation occurred", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(BaseBusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BaseBusinessException ex) {
        log.warn("Business exception [{}]: {}", ex.getErrorCode(), ex.getMessage());
        List<ApiError> errors = List.of(ApiError.ofMessage(ex.getMessage(), ex.getErrorCode()));
        ApiResponse<Void> response = ApiResponse.failure(ex.getMessage(), errors);
        return ResponseEntity.status(ex.getStatus()).body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed HTTP request body: {}", ex.getMessage());
        List<ApiError> errors = List.of(ApiError.ofMessage("Required request body is missing or malformed", "MALFORMED_REQUEST"));
        ApiResponse<Void> response = ApiResponse.failure("Invalid request payload format", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        log.warn("Argument type mismatch: {}", ex.getMessage());
        String message = String.format("Parameter '%s' should be of type '%s'",
                ex.getName(),
                ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");
        List<ApiError> errors = List.of(ApiError.of(ex.getName(), ex.getValue(), message, "TYPE_MISMATCH"));
        ApiResponse<Void> response = ApiResponse.failure("Invalid parameter type", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("HTTP method not supported: {}", ex.getMethod());
        List<ApiError> errors = List.of(ApiError.ofMessage(
                String.format("Method %s is not supported for this endpoint. Supported methods: %s",
                        ex.getMethod(), ex.getSupportedHttpMethods()),
                "METHOD_NOT_ALLOWED"
        ));
        ApiResponse<Void> response = ApiResponse.failure("HTTP method not allowed", errors);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        log.error("Unhandled internal server error occurred", ex);
        List<ApiError> errors = List.of(ApiError.ofMessage(
                "An unexpected internal error occurred. Please contact system support.",
                "INTERNAL_SERVER_ERROR"
        ));
        ApiResponse<Void> response = ApiResponse.failure("Internal server error", errors);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
