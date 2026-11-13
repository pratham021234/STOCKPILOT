package com.stockpilot.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

/**
 * Standardized API response envelope for all StockPilot REST endpoints.
 *
 * @param <T> Payload body type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standard API response envelope")
public class ApiResponse<T> {

    @Schema(description = "Indicates whether the request was successful", example = "true")
    private boolean success;

    @Schema(description = "Human-readable message describing the outcome", example = "Operation completed successfully")
    private String message;

    @Schema(description = "Response data payload")
    private T data;

    @Schema(description = "List of validation or operational errors when success is false")
    private List<ApiError> errors;

    @Schema(description = "Timestamp when the response was generated")
    @Builder.Default
    private Instant timestamp = Instant.now();

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Request processed successfully")
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(Collections.emptyList())
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, List<ApiError> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors != null ? errors : Collections.emptyList())
                .timestamp(Instant.now())
                .build();
    }
}
