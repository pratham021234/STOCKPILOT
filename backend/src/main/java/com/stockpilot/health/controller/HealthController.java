package com.stockpilot.health.controller;

import com.stockpilot.common.api.ApiResponse;
import com.stockpilot.health.dto.HealthStatusDto;
import com.stockpilot.health.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing REST endpoints for monitoring system availability and infrastructure dependencies.
 */
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Tag(name = "Health & Diagnostics", description = "System vitality, dependency verification, and uptime probes")
public class HealthController {

    private final HealthService healthService;

    @GetMapping
    @Operation(summary = "Get system health status", description = "Checks the operational status of the service and backing database.")
    public ResponseEntity<ApiResponse<HealthStatusDto>> getHealth() {
        HealthStatusDto health = healthService.checkHealth();
        return ResponseEntity.ok(ApiResponse.success(health, "System is operational"));
    }
}

