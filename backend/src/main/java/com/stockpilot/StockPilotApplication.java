package com.stockpilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * StockPilot - Enterprise Multi-Tenant Inventory & Warehouse Platform
 * Main Spring Boot Entry Point.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class StockPilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockPilotApplication.class, args);
    }
}
