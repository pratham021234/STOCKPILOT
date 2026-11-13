-- ==============================================================================
-- StockPilot Database Migration V1
-- Enterprise Multi-Tenant Foundation Schema
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations (Tenant root entity)
CREATE TABLE IF NOT EXISTS organizations (
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

CREATE INDEX idx_organizations_slug ON organizations (slug);
CREATE INDEX idx_organizations_status ON organizations (status);

-- Seed initial demonstration organization for development/staging
INSERT INTO organizations (id, name, slug, legal_name, currency, timezone, status, created_at, updated_at, version)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Acme Logistics & Retail',
    'acme-logistics',
    'Acme International Global Supplies Inc.',
    'USD',
    'America/New_York',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0
) ON CONFLICT (slug) DO NOTHING;

