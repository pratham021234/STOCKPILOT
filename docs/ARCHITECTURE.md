# StockPilot — Enterprise Architecture Document

## 1. System Vision & Paradigm

StockPilot is engineered as an enterprise-grade Software-as-a-Service (SaaS) platform for multi-facility inventory control, procurement, warehouse operations, and sales fulfillment.

Rather than a simple CRUD application, StockPilot addresses mission-critical constraints:
- **Zero Negative Inventory**: Physical and logical balances are rigorously checked using pessimistic locking and atomic database state transitions.
- **Explicit Multi-Tenancy**: Tenant isolation is enforced at the data layer and bounded-context boundary (`organization_id` foreign keys and tenant-scoped transactions).
- **Audit-First Event Ledger**: Every balance transition writes an immutable `stock_movement` record.
- **Transactional Outbox Pattern**: State persistence and asynchronous event publishing (Kafka) are executed within the same database transaction boundary to prevent distributed dual-write inconsistencies.

---

## 2. High-Level Modular Monolith Architecture

StockPilot adopts a **Modular Monolith** architecture pattern. It preserves compile-time cohesion and unified operational deployment while enforcing strict domain boundary isolation across distinct modules:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      StockPilot Application Shell                      │
├────────────────────────────────────────────────────────────────────────┤
│  REST API Gateway & Controllers (OpenAPI / Swagger Documentation)       │
├────────────────────────────────────────────────────────────────────────┤
│                             BOUNDED CONTEXTS                           │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ 01. Identity & Auth  │ │ 02. Organization/Ten │ │ 03. Catalogue    │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ 04. Warehouse MGMT   │ │ 05. Inventory Engine │ │ 06. Supplier Hub │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ 07. Procurement (PO) │ │ 08. Goods Receiving  │ │ 09. Sales Orders │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ 10. Stock Reserv.    │ │ 11. Transfers (2PC)  │ │ 12. Returns/RMA  │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐ │
│ │ 13. Analytics (Batch)│ │ 14. Notifications    │ │ 15. Audit Ledger │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│                     Cross-Cutting Infrastructure                       │
│  Flyway Migrations │ Outbox Publisher │ HikariCP │ Central Exceptions │
├───────────────────────────────────┬────────────────────────────────────┤
│         PostgreSQL 16             │         Apache Kafka / Redis       │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 3. Package & Layering Conventions

The backend follows clean architecture with clear separation of concerns:

- `com.stockpilot.common.api`: Standard API response envelopes (`ApiResponse<T>`, `PagedResponse<T>`, `PageMetadata`).
- `com.stockpilot.common.config`: Cross-cutting Spring beans (OpenAPI, CORS, WebMvc, Hikari).
- `com.stockpilot.common.exception`: Centralized exceptions and `@RestControllerAdvice` error transformer.
- `com.stockpilot.<module>.controller`: Exclusively responsible for HTTP mapping, parameter binding, and delegating to services. Controllers contain **no business logic**.
- `com.stockpilot.<module>.service`: Application service and domain logic boundary. Enforces transactions (`@Transactional`), idempotency checks, and tenant verification.
- `com.stockpilot.<module>.repository`: Spring Data JPA data access interfaces.
- `com.stockpilot.<module>.model` / `entity`: JPA entities mapping to relational tables.
- `com.stockpilot.<module>.dto`: Request and response Transfer Objects with Bean Validation (`@NotNull`, `@Size`, `@Pattern`).

---

## 4. Transactional Outbox Pattern for Kafka

To guarantee that inventory state changes in PostgreSQL are never decoupled from Kafka event stream publication:
1. Business entity mutation (e.g. `inventory_balance`, `stock_movement`) is written to PostgreSQL.
2. In the same database transaction, an `outbox_events` record is inserted.
3. Once committed, an asynchronous outbox publisher worker reads pending outbox events, delivers them to Kafka, and marks them `SENT`.
4. If Kafka is temporarily unreachable, the database transaction remains intact and the event is retried with exponential backoff.

---

## 5. Frontend Architecture

The frontend is built using **React 18**, **TypeScript**, and **Vite**:
- **Design System**: Tailwind CSS with custom HSL token architecture and shadcn/ui components.
- **Routing**: Client-side routing with `react-router-dom` v6, structured with an `AppShell` featuring a dark navy sidebar (`#0b1120`), responsive mobile drawer, and quick-access top navigation.
- **Server State Management**: `@tanstack/react-query` v5 handles caching, background polling (such as real-time health checks), and optimistic UI updates.
- **Form & Input Validation**: `react-hook-form` paired with `zod` type schemas.
- **Data Visualization**: `recharts` for inventory flow velocity and turnover telemetry.

