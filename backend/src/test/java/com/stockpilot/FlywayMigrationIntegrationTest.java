package com.stockpilot;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Verifies that Flyway database migrations execute cleanly and seed foundational entities.
 * Can run against the local Docker PostgreSQL container or CI service.
 */
@SpringBootTest
@DisplayName("Flyway Database Migration & Schema Integration Test")
class FlywayMigrationIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Should execute V1 Flyway migration and seed default organization")
    void shouldExecuteFlywayMigrationAndSeedData() {
        // Verify flyway_schema_history table exists and migration succeeded
        Integer migrationCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success = true",
                Integer.class
        );
        assertNotNull(migrationCount, "flyway_schema_history count should not be null");
        assertTrue(migrationCount >= 1, "At least 1 Flyway migration should have executed successfully");

        // Verify organizations table exists and seeded record is present
        Integer orgCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM organizations WHERE slug = 'acme-logistics'",
                Integer.class
        );
        assertNotNull(orgCount, "organizations count should not be null");
        assertEquals(1, orgCount, "The seeded 'acme-logistics' organization must exist in the database");
    }
}
