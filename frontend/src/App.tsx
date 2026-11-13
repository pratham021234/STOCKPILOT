import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { OverviewPage } from "@/pages/dashboard/OverviewPage";
import { ModulePlaceholder } from "@/pages/common/ModulePlaceholder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            
            {/* Core Inventory Modules */}
            <Route
              path="products"
              element={
                <ModulePlaceholder
                  moduleName="Product Catalogue"
                  description="Global multi-variant SKU registry, barcode assignment, attributes, and unit of measure (UoM) configurations."
                  scheduledPhase="Phase 3"
                  features={[
                    "Universal SKU & UPC/EAN barcode support",
                    "Multi-tier category trees and tag taxonomies",
                    "Product dimension, weight and hazardous classifications",
                    "Cost history and supplier pricing matrices",
                  ]}
                />
              }
            />
            <Route
              path="categories"
              element={
                <ModulePlaceholder
                  moduleName="Category Management"
                  description="Hierarchical organization of stock lines, taxonomy attributes, and reorder policy defaults."
                  scheduledPhase="Phase 3"
                  features={[
                    "Infinite-depth nested category hierarchies",
                    "Default reorder buffers and lead times by category",
                    "Dynamic categorization filters for stocktaking",
                  ]}
                />
              }
            />
            <Route
              path="warehouses"
              element={
                <ModulePlaceholder
                  moduleName="Warehouse & Facility Management"
                  description="Multi-facility locations, zones, aisles, racks, shelves, and bin tracking."
                  scheduledPhase="Phase 4"
                  features={[
                    "Zone and Bin location layout mapping",
                    "Warehouse capacity thresholds and volume metrics",
                    "Dedicated receiving dock and quarantine areas",
                    "Cross-docking and pick-face configurations",
                  ]}
                />
              }
            />
            <Route
              path="inventory"
              element={
                <ModulePlaceholder
                  moduleName="Stock Position & Availability"
                  description="Real-time physical, reserved, available, and incoming stock balances per SKU and location."
                  scheduledPhase="Phase 5"
                  features={[
                    "Physical vs available stock calculations",
                    "Pessimistic/optimistic lock safe concurrent adjustments",
                    "Batch, lot, and serial number tracking",
                    "Safety stock and automated reorder triggers",
                  ]}
                />
              }
            />

            {/* Operations & Movements */}
            <Route
              path="stock-movements"
              element={
                <ModulePlaceholder
                  moduleName="Stock Movement Audit Ledger"
                  description="Immutable event-sourced ledger of every physical and logical inventory transition."
                  scheduledPhase="Phase 5"
                  features={[
                    "Cryptographically signed movement audit log",
                    "Zero-negative-stock validation enforcement",
                    "Operator tracking and timestamped attribution",
                    "Transactional outbox event streaming to Kafka",
                  ]}
                />
              }
            />
            <Route
              path="stock-transfers"
              element={
                <ModulePlaceholder
                  moduleName="Stock Transfers"
                  description="Inter-warehouse stock requests, transit verification, and two-phase dispatch/receipt."
                  scheduledPhase="Phase 6"
                  features={[
                    "Source-outbound to destination-inbound 2-phase commit",
                    "Transit shrinkage and variance reporting",
                    "Carrier tracking integration",
                  ]}
                />
              }
            />
            <Route
              path="suppliers"
              element={
                <ModulePlaceholder
                  moduleName="Supplier Directory"
                  description="Vendor contracts, lead times, contact profiles, and procurement agreements."
                  scheduledPhase="Phase 7"
                  features={[
                    "Vendor performance and on-time fulfillment scoring",
                    "Supplier SKU cross-referencing",
                    "Payment terms and default delivery currencies",
                  ]}
                />
              }
            />
            <Route
              path="purchase-orders"
              element={
                <ModulePlaceholder
                  moduleName="Purchase Orders"
                  description="Inbound replenishment workflows, approval hierarchies, and PO line items."
                  scheduledPhase="Phase 7"
                  features={[
                    "Approval matrix and expenditure authorization gates",
                    "Automated reorder PO generation from low-stock alerts",
                    "Expected delivery schedules and milestone tracking",
                  ]}
                />
              }
            />
            <Route
              path="goods-receipts"
              element={
                <ModulePlaceholder
                  moduleName="Goods Receiving & QA"
                  description="Dock receiving, physical inspection, discrepancy claims, and stock incrementation."
                  scheduledPhase="Phase 8"
                  features={[
                    "Blind and PO-matched dock check-in",
                    "Damaged goods quarantine and return slips",
                    "Automated stock increase upon acceptance",
                  ]}
                />
              }
            />
            <Route
              path="sales-orders"
              element={
                <ModulePlaceholder
                  moduleName="Sales Order Management"
                  description="Order intake, stock reservation locking, pick-pack-ship, and dispatch."
                  scheduledPhase="Phase 9"
                  features={[
                    "Instant stock reservation on order creation",
                    "Reservation timeout and automatic release on cancellation",
                    "Multi-warehouse fulfillment routing rules",
                  ]}
                />
              }
            />
            <Route
              path="returns"
              element={
                <ModulePlaceholder
                  moduleName="Returns & RMA Management"
                  description="Return authorization, inspection grading, restocking, and customer credit ledger."
                  scheduledPhase="Phase 10"
                  features={[
                    "Mandatory return inspection prior to inventory restoration",
                    "Restock vs scrap disposition workflows",
                    "RMA tracking and vendor debit notes",
                  ]}
                />
              }
            />

            {/* Intelligence & Settings */}
            <Route
              path="reports"
              element={
                <ModulePlaceholder
                  moduleName="Reporting & Inventory Analytics"
                  description="FIFO/LIFO/Weighted Average valuation, ABC inventory analysis, and turnover metrics."
                  scheduledPhase="Phase 11"
                  features={[
                    "COGS and stock valuation reporting",
                    "ABC analysis and dead stock indicators",
                    "Spring Batch scheduled export jobs",
                  ]}
                />
              }
            />
            <Route
              path="notifications"
              element={
                <ModulePlaceholder
                  moduleName="Notification Center"
                  description="Stockout alerts, order updates, PO approval notifications, and system events."
                  scheduledPhase="Phase 12"
                  features={[
                    "Real-time WebSocket alerts",
                    "Configurable alert thresholds by category",
                    "Email and webhook integrations",
                  ]}
                />
              }
            />
            <Route
              path="team"
              element={
                <ModulePlaceholder
                  moduleName="Team & Role-Based Access Control"
                  description="Fine-grained permissions, warehouse operator roles, and tenant staff directory."
                  scheduledPhase="Phase 2"
                  features={[
                    "Role assignments: Super Admin, Warehouse Manager, Clerk, Auditor",
                    "Warehouse-scoped permissions",
                    "Session management and active login monitoring",
                  ]}
                />
              }
            />
            <Route
              path="settings"
              element={
                <ModulePlaceholder
                  moduleName="Organization & Tenant Settings"
                  description="Tenant profile, default currency, timezones, tax identifiers, and system preferences."
                  scheduledPhase="Phase 2"
                  features={[
                    "Multi-currency configuration",
                    "Tenant isolation parameters",
                    "Custom branding and notification rules",
                  ]}
                />
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

