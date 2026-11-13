package com.stockpilot.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 3.0 specification configuration for StockPilot REST API documentation.
 */
@Configuration
public class OpenApiConfig {

    @Value("${stockpilot.app.name:StockPilot Enterprise}")
    private String appName;

    @Value("${stockpilot.app.version:1.0.0}")
    private String appVersion;

    @Value("${stockpilot.app.environment:development}")
    private String environment;

    @Bean
    public OpenAPI stockPilotOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title(appName + " API")
                        .description("High-reliability multi-tenant inventory, procurement, and warehouse management platform.")
                        .version(appVersion)
                        .contact(new Contact()
                                .name("StockPilot Platform Team")
                                .email("engineering@stockpilot.internal"))
                        .license(new License()
                                .name("Proprietary Enterprise License")
                                .url("https://stockpilot.internal/license")))
                .servers(List.of(
                        new Server().url("/").description("Current Server Context (" + environment + ")")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT Bearer token to authorize requests (configured for upcoming Auth module)")));
    }
}
