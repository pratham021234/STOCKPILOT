package com.stockpilot.common.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ApiResponse Standard Envelope Tests")
class ApiResponseTest {

    @Test
    @DisplayName("Should construct successful response with default message")
    void shouldCreateSuccessResponse() {
        String payload = "test payload";
        ApiResponse<String> response = ApiResponse.success(payload);

        assertTrue(response.isSuccess());
        assertEquals("Request processed successfully", response.getMessage());
        assertEquals(payload, response.getData());
        assertNotNull(response.getTimestamp());
        assertNull(response.getErrors());
    }

    @Test
    @DisplayName("Should construct successful response with custom message")
    void shouldCreateSuccessResponseWithCustomMessage() {
        ApiResponse<Integer> response = ApiResponse.success(42, "Computed successfully");

        assertTrue(response.isSuccess());
        assertEquals("Computed successfully", response.getMessage());
        assertEquals(42, response.getData());
    }

    @Test
    @DisplayName("Should construct failure response with error list")
    void shouldCreateFailureResponseWithErrors() {
        List<ApiError> errors = List.of(
                ApiError.of("sku", "SKU cannot be blank"),
                ApiError.of("quantity", "Quantity must be positive")
        );

        ApiResponse<Void> response = ApiResponse.failure("Validation failed", errors);

        assertFalse(response.isSuccess());
        assertEquals("Validation failed", response.getMessage());
        assertNull(response.getData());
        assertEquals(2, response.getErrors().size());
        assertEquals("sku", response.getErrors().get(0).getField());
    }
}

