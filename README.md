# StockPilot — Enterprise Multi-Tenant Inventory & Warehouse Platform

[![CI Pipeline](https://github.com/stockpilot/stockpilot/actions/workflows/ci.yml/badge.svg)](https://github.com/stockpilot/stockpilot/actions)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)

**StockPilot** is an enterprise-grade multi-tenant inventory, procurement, warehouse, and sales order fulfillment platform engineered for retailers, wholesalers, and multi-facility distribution operations.

---

## Architecture Highlights

- **Modular Monolith**: Clean domain boundaries separating Identity, Tenancy, Catalogue, Warehouses, Inventory, Procurement, Orders, Transfers, Returns, and Reporting.
- **Strict Multi-Tenancy**: Explicit organization-scoped isolation at the database layer (`organizations` tenant root).
- **Zero Negative Inventory Guarantee**: Atomic database checks, optimistic/pessimistic locking, and stock reservation decoupling.
- **Immutable Stock Movement Ledger**: Every physical and logical inventory transition writes an immutable audit record.
- **Transactional Outbox Event Streaming**: Eliminates distributed dual-write inconsistency when publishing to Apache Kafka.
- **Database Migrations via Flyway**: Zero automatic Hibernate schema mutation in production.
- **Standardized API Response**: Consistent `ApiResponse<T>` envelope, pagination envelopes, and centralized `@RestControllerAdvice` error transformer.
- **Enterprise Design System**: Modern dark navy sidebar navigation, restrained blue accent, responsive layout, Recharts data visualizers, and TanStack Query caching.

---

## Project Structure

```
stockpilot/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI for Java 21, Maven, PostgreSQL & Vite
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/stockpilot/
│   │   │   │   ├── common/
│   │   │   │   │   ├── api/       # ApiResponse, ApiError, PagedResponse, PageMetadata
│   │   │   │   │   ├── config/    # OpenApiConfig, CorsConfig
│   │   │   │   │   └── exception/ # GlobalExceptionHandler, BaseBusinessException, etc.
│   │   │   │   ├── health/        # HealthController (/api/v1/health), DTOs, HealthService
│   │   │   │   └── StockPilotApplication.java
│   │   │   └── resources/
│   │   │       ├── db/migration/  # V1__init_schema.sql (PostgreSQL schema & seed data)
│   │   │       └── application.yml
│   │   └── test/
│   │       ├── java/com/stockpilot/
│   │       │   ├── common/api/    # ApiResponse envelope unit tests
│   │       │   ├── common/exception/ # Central exception handling unit tests
│   │       │   ├── health/        # HealthController MockMvc integration tests
│   │       │   └── FlywayMigrationIntegrationTest.java # Flyway & PostgreSQL integration test
│   │       └── resources/
│   │           └── application-test.yml
│   └── pom.xml                    # Maven Java 21, Spring Boot 3.3.5, Testcontainers, Flyway
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Sidebar (dark navy), Header, AppShell
│   │   │   └── ui/                # Button, Card, Badge, Table, Skeleton (shadcn/ui)
│   │   ├── pages/
│   │   │   ├── common/            # ModulePlaceholder (navigation structure)
│   │   │   └── dashboard/         # OverviewPage (KPIs, Recharts trends, movements ledger)
│   │   ├── services/              # API client communicating with backend
│   │   ├── types/                 # TypeScript interfaces for API, Health, Movements
│   │   ├── lib/                   # Utility helpers (cn, formatCurrency, formatDate)
│   │   ├── App.tsx                # React Router v6 navigation structure
│   │   ├── main.tsx               # Root entry point
│   │   └── index.css              # Tailwind CSS styles & design tokens
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── infrastructure/
│   └── docker/
│       └── docker-compose.yml     # PostgreSQL 16, Redis 7, Kafka KRaft
├── docs/
│   ├── ARCHITECTURE.md            # Detailed modular monolith design & outbox pattern
│   ├── DATABASE_DESIGN.md         # Relational schema, indexes & multi-tenancy rules
│   └── LOCAL_SETUP.md             # Developer environment step-by-step instructions
├── .env.example                   # Environment configuration template
├── docker-compose.yml             # Root developer docker compose orchestration
└── README.md
```

---

## Quick Start (Windows CMD)

### 1. Start Infrastructure (PostgreSQL & Redis)
```cmd
copy .env.example .env
docker compose up -d postgres redis
```

### 2. Run Backend Tests & Start Server
```cmd
cd backend
mvn test
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080`
- System Health: `http://localhost:8080/api/v1/health`
- Swagger Documentation: `http://localhost:8080/swagger-ui.html`

### 3. Run Frontend
```cmd
cd ..\frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## Phase 1 Implementation Summary

Phase 1 establishes the rock-solid foundational architecture of StockPilot:
1. **Spring Boot 3.3.5 / Java 21 Foundation**: Fully configured with Flyway database migrations, Hikari connection pooling, Actuator, and OpenAPI 3.0.
2. **Centralized Exception Handling & API Conventions**: Comprehensive `@RestControllerAdvice` mapping validation, business rules, conflict errors, and malformed payloads into standard `ApiResponse<T>` envelopes.
3. **Database Migration V1**: Multi-tenant `organizations` schema with UUID primary keys and default seeded organization (`acme-logistics`).
4. **React / Vite / TypeScript Frontend**: Complete responsive `AppShell` with dark navy sidebar navigation, live backend health check telemetry, Recharts velocity analytics, recent movements data table, and placeholder routes for all 16 core business modules.
5. **Infrastructure**: Production-grade Docker Compose for PostgreSQL 16, Redis 7, and Apache Kafka KRaft.
6. **Testing**: 8 automated JUnit 5 tests covering API envelopes, global exception handling, Spring WebMvc health integration, and Flyway database execution against PostgreSQL.
