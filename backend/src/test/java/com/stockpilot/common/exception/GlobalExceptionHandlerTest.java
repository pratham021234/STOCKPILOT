package com.stockpilot.common.exception;

import com.stockpilot.common.api.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GlobalExceptionHandler Unit Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("Should handle ResourceNotFoundException and return 404")
    void shouldHandleResourceNotFoundException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Warehouse", "WH-001");

        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBusinessException(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("WH-001"));
        assertEquals(1, response.getBody().getErrors().size());
        assertEquals("RESOURCE_NOT_FOUND", response.getBody().getErrors().get(0).getCode());
    }

    @Test
    @DisplayName("Should handle ConflictException and return 409")
    void shouldHandleConflictException() {
        ConflictException ex = new ConflictException("Product", "sku", "PROD-100");

        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleBusinessException(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("RESOURCE_CONFLICT", response.getBody().getErrors().get(0).getCode());
    }

    @Test
    @DisplayName("Should handle General Exception and return 500 without leaking stacktrace")
    void shouldHandleGeneralException() {
        Exception ex = new RuntimeException("Unexpected internal failure");

        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleGeneralException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Internal server error", response.getBody().getMessage());
        assertEquals("INTERNAL_SERVER_ERROR", response.getBody().getErrors().get(0).getCode());
    }
}

