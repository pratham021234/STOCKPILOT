package com.stockpilot.health.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

/**
 * Health and operational status response payload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "System health and operational status")
public class HealthStatusDto {

    @Schema(description = "Overall application status", example = "UP")
    private String status;

    @Schema(description = "Application name", example = "StockPilot Enterprise Inventory")
    private String appName;

    @Schema(description = "Application version", example = "1.0.0-phase1")
    private String version;

    @Schema(description = "Running environment profile", example = "development")
    private String environment;

    @Schema(description = "Current server timestamp")
    private Instant timestamp;

    @Schema(description = "Application uptime in seconds", example = "360")
    private long uptimeSeconds;

    @Schema(description = "Health status of dependent subsystems")
    private Map<String, Object> components;
}

