package com.stockpilot.health.service;

import com.stockpilot.health.dto.HealthStatusDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Service responsible for probing system vitality and core dependencies.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HealthService {

    private final DataSource dataSource;

    @Value("${stockpilot.app.name:StockPilot Enterprise Inventory}")
    private String appName;

    @Value("${stockpilot.app.version:1.0.0-phase1}")
    private String version;

    @Value("${stockpilot.app.environment:development}")
    private String environment;

    public HealthStatusDto checkHealth() {
        Map<String, Object> components = new HashMap<>();

        // Test Database Connectivity
        boolean dbHealthy = false;
        try (Connection connection = dataSource.getConnection()) {
            dbHealthy = connection.isValid(2);
            components.put("database", Map.of(
                    "status", dbHealthy ? "UP" : "DOWN",
                    "type", "PostgreSQL",
                    "catalog", connection.getCatalog() != null ? connection.getCatalog() : "unknown"
            ));
        } catch (Exception ex) {
            log.warn("Database health check probe failed: {}", ex.getMessage());
            components.put("database", Map.of(
                    "status", "DOWN",
                    "error", ex.getMessage()
            ));
        }

        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        String overallStatus = dbHealthy ? "UP" : "DEGRADED";

        return HealthStatusDto.builder()
                .status(overallStatus)
                .appName(appName)
                .version(version)
                .environment(environment)
                .timestamp(Instant.now())
                .uptimeSeconds(uptimeSeconds)
                .components(components)
                .build();
    }
}

