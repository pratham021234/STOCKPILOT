# StockPilot — Database Design & Schema Evolution Strategy

## 1. Relational Database Principles

StockPilot utilizes **PostgreSQL 16** with strict relational integrity constraints:
- **No Automatic Schema Generation in Production**: Hibernate `ddl-auto` is set to `validate`. All DDL operations must be authored in Flyway migrations located in `backend/src/main/resources/db/migration/`.
- **UUID Primary Keys**: All domain entities utilize Version 4 UUIDs (`gen_random_uuid()`) to prevent enumeration attacks and support distributed id generation.
- **Optimistic Locking**: Every business entity includes an integer/bigint `version` column managed by Hibernate `@Version` to prevent lost update anomalies during concurrent edits.
- **Audit Columns**: Every table maintains `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` and `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`.

---

## 2. Multi-Tenancy Architecture

StockPilot employs a **Discriminator Column Strategy** (`organization_id UUID NOT NULL`):
- Every tenant query filters explicitly by `organization_id`.
- Foreign key constraints ensure data consistency across tenant-scoped tables.
- Database indexes are placed on composite keys `(organization_id, ...)` to optimize query plans and prevent table scans across tenant partitions.

---

## 3. Core Bounded Context Schemas

### 3.1 Organization & Tenancy (`V1__init_schema.sql`)
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    legal_name VARCHAR(255),
    tax_identifier VARCHAR(100),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);
```

### 3.2 Product Catalogue Schema (Upcoming Phase 3)
- `products`: `(id, organization_id, sku, barcode, name, description, category_id, uom, status, ...)`
- `categories`: `(id, organization_id, parent_id, name, slug, ...)`

### 3.3 Warehouse & Facility Schema (Upcoming Phase 4)
- `warehouses`: `(id, organization_id, code, name, address, active, ...)`
- `warehouse_zones`: `(id, warehouse_id, code, name, zone_type, ...)`
- `warehouse_bins`: `(id, zone_id, code, max_weight, max_volume, ...)`

### 3.4 Inventory & Stock Balance Schema (Upcoming Phase 5)
```sql
CREATE TABLE inventory_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    warehouse_id UUID NOT NULL,
    product_id UUID NOT NULL,
    physical_quantity INT NOT NULL CHECK (physical_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    available_quantity INT GENERATED ALWAYS AS (physical_quantity - reserved_quantity) STORED,
    reorder_point INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_positive_available CHECK (physical_quantity >= reserved_quantity),
    CONSTRAINT uq_wh_product UNIQUE (warehouse_id, product_id)
);
```

### 3.5 Immutable Stock Movements Ledger (Upcoming Phase 5)
```sql
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    warehouse_id UUID NOT NULL,
    product_id UUID NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- INBOUND, OUTBOUND, TRANSFER, RESERVATION, RELEASE, ADJUSTMENT
    quantity INT NOT NULL,
    balance_before INT NOT NULL,
    balance_after INT NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- PO, SO, TRANSFER_ORDER, AUDIT
    reference_id VARCHAR(100) NOT NULL,
    performed_by UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Flyway Migration Versioning Rules

1. Format: `V<Version>__<Description>.sql` (e.g. `V1__init_schema.sql`, `V2__auth_and_users.sql`).
2. Migrations must be strictly backward-compatible.
3. Once applied to shared or production databases, migration files are immutable.
