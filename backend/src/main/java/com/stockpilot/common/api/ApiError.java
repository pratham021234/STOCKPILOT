package com.stockpilot.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Detailed error descriptor for validation failures and business rule violations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Details of a specific error")
public class ApiError {

    @Schema(description = "Field name associated with the error (if validation related)", example = "sku")
    private String field;

    @Schema(description = "Rejected input value if applicable", example = "")
    private Object rejectedValue;

    @Schema(description = "Human-readable description of why the field or action is invalid", example = "SKU must not be blank")
    private String message;

    @Schema(description = "Machine-readable error code", example = "FIELD_REQUIRED")
    private String code;

    public static ApiError of(String field, String message) {
        return ApiError.builder()
                .field(field)
                .message(message)
                .build();
    }

    public static ApiError of(String field, Object rejectedValue, String message, String code) {
        return ApiError.builder()
                .field(field)
                .rejectedValue(rejectedValue)
                .message(message)
                .code(code)
                .build();
    }

    public static ApiError ofMessage(String message, String code) {
        return ApiError.builder()
                .message(message)
                .code(code)
                .build();
    }
}

