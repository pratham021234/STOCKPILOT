import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  DollarSign,
  Warehouse,
  AlertTriangle,
  ShoppingCart,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Server,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHealthStatus } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";

// Seeded realistic demonstration data (identified as demo data per Phase 1 specification)
const DEMO_METRICS = {
  totalProducts: 1420,
  totalInventoryValue: 2845600,
  totalWarehouses: 6,
  lowStockAlerts: 14,
  pendingPurchaseOrders: 8,
  pendingSalesOrders: 23,
};

const DEMO_TRENDS = [
  { month: "Jan", inbound: 4200, outbound: 3800 },
  { month: "Feb", inbound: 5100, outbound: 4600 },
  { month: "Mar", inbound: 6400, outbound: 5900 },
  { month: "Apr", inbound: 5800, outbound: 6100 },
  { month: "May", inbound: 7200, outbound: 6800 },
  { month: "Jun", inbound: 8100, outbound: 7400 },
  { month: "Jul", inbound: 7600, outbound: 7900 },
];

const DEMO_RECENT_MOVEMENTS = [
  {
    id: "MOV-8901",
    sku: "ELEC-MBP-16",
    product: "MacBook Pro 16\" M3 Max",
    type: "INBOUND",
    quantity: "+50",
    warehouse: "Central Logistics Hub (NJ)",
    ref: "PO-2026-089",
    date: "2026-11-13T16:45:00Z",
    status: "COMPLETED",
  },
  {
    id: "MOV-8902",
    sku: "MON-DELL-4K",
    product: "Dell UltraSharp 32\" 4K",
    type: "RESERVATION",
    quantity: "-12",
    warehouse: "West Coast Distribution (CA)",
    ref: "SO-2026-512",
    date: "2026-11-13T15:20:00Z",
    status: "RESERVED",
  },
  {
    id: "MOV-8903",
    sku: "NET-CISCO-8P",
    product: "Cisco Catalyst 24-Port Gigabit",
    type: "TRANSFER",
    quantity: "20",
    warehouse: "Central Hub -> Dallas Node",
    ref: "TR-2026-034",
    date: "2026-11-13T14:05:00Z",
    status: "IN_TRANSIT",
  },
  {
    id: "MOV-8904",
    sku: "ACC-LOGI-MX3",
    product: "Logitech MX Master 3S",
    type: "OUTBOUND",
    quantity: "-35",
    warehouse: "Dallas Express Depot (TX)",
    ref: "SO-2026-499",
    date: "2026-11-13T11:30:00Z",
    status: "COMPLETED",
  },
  {
    id: "MOV-8905",
    sku: "PWR-ANK-65W",
    product: "Anker GaNPrime 65W Fast Charger",
    type: "ADJUSTMENT",
    quantity: "-2",
    warehouse: "Chicago North Facility (IL)",
    ref: "ADJ-CYCLE-09",
    date: "2026-11-13T09:15:00Z",
    status: "VERIFIED",
  },
];

const DEMO_FAST_MOVING = [
  { sku: "ELEC-MBP-16", name: "MacBook Pro 16\" M3 Max", turnoverRate: "4.8x/mo", unitsSold: 412, stockLevel: 88 },
  { sku: "ACC-LOGI-MX3", name: "Logitech MX Master 3S", turnoverRate: "4.1x/mo", unitsSold: 620, stockLevel: 145 },
  { sku: "MON-DELL-4K", name: "Dell UltraSharp 32\" 4K", turnoverRate: "3.6x/mo", unitsSold: 180, stockLevel: 32 },
  { sku: "NET-CISCO-8P", name: "Cisco Catalyst 24-Port", turnoverRate: "3.2x/mo", unitsSold: 94, stockLevel: 26 },
];

export const OverviewPage: React.FC = () => {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ["systemHealth"],
    queryFn: fetchHealthStatus,
  });

  return (
    <div className="space-y-8">
      {/* Page Header and Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Operations & Inventory Overview
            </h1>
            <Badge variant="outline" className="text-slate-600 bg-white">
              Tenant: Acme Logistics
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time multi-warehouse inventory position, active movements, and fulfillment telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => refetchHealth()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Stock Movement
          </Button>
        </div>
      </div>

      {/* Live System Vitality Banner (Demonstrates Phase 1 Backend Connection) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50/80 via-white to-slate-50 border border-blue-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-100/80 text-blue-700">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Core Engine Telemetry
              </span>
              {isHealthLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : health?.status === "UP" ? (
                <Badge variant="success" className="text-[11px]">System Online (Java 21)</Badge>
              ) : (
                <Badge variant="warning" className="text-[11px]">Degraded State</Badge>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-4">
              <span>Environment: <strong className="text-slate-700">{health?.environment || "development"}</strong></span>
              <span>API Gateway: <strong className="text-slate-700">{health?.appName || "StockPilot Backend"}</strong></span>
              <span>Database: <strong className="text-emerald-700">PostgreSQL (Flyway V1 Seeded)</strong></span>
              <span>Uptime: <strong className="text-slate-700">{health?.uptimeSeconds || 0}s</strong></span>
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 self-end md:self-center">
          Phase 1 Foundation Operational
        </div>
      </div>

      {/* Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Products
              </span>
              <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_METRICS.totalProducts.toLocaleString()}
              </div>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12 new this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Inventory Value
              </span>
              <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(DEMO_METRICS.totalInventoryValue)}
              </div>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +4.2% vs last cycle
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Warehouses
              </span>
              <div className="p-2 rounded-md bg-purple-50 text-purple-600">
                <Warehouse className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_METRICS.totalWarehouses} Active
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                Across 4 regional nodes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Low-Stock Alerts
              </span>
              <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-amber-600">
                {DEMO_METRICS.lowStockAlerts} SKUs
              </div>
              <span className="text-[11px] font-medium text-amber-700 mt-1 block">
                Requires reorder action
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pending POs
              </span>
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_METRICS.pendingPurchaseOrders} Orders
              </div>
              <span className="text-[11px] font-medium text-indigo-600 flex items-center gap-0.5 mt-1">
                <ArrowDownLeft className="w-3 h-3" /> Awaiting dock arrival
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Pending Sales
              </span>
              <div className="p-2 rounded-md bg-rose-50 text-rose-600">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_METRICS.pendingSalesOrders} Orders
              </div>
              <span className="text-[11px] font-medium text-rose-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> In fulfillment queue
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Velocity & Flow Chart */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Inventory Velocity & Throughput
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Monthly inbound replenishment vs outbound fulfillment movements (units)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-slate-600">Inbound (Dock Receipts)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-slate-400" />
                <span className="text-slate-600">Outbound (Fulfillment)</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={DEMO_TRENDS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInbound)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stroke="#64748b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOutbound)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fast-Moving SKUs Ranking */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Fast-Moving Products
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Highest turnover velocity this cycle
                </CardDescription>
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {DEMO_FAST_MOVING.map((item, index) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400">
                        0{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      SKU: {item.sku}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">
                      {item.turnoverRate}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.stockLevel} in stock
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stock Movements Table Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Audit & Stock Movements
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Immutable ledger of recent inventory increases, reservations, releases, and transfers
            </CardDescription>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
              Showing 5 recent operations
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movement ID</TableHead>
                <TableHead>Product / SKU</TableHead>
                <TableHead>Movement Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Warehouse Location</TableHead>
                <TableHead>Reference Document</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_RECENT_MOVEMENTS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs font-semibold text-blue-600">
                    {m.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 text-xs">{m.product}</div>
                    <div className="font-mono text-[11px] text-slate-400">{m.sku}</div>
                  </TableCell>
                  <TableCell>
                    {m.type === "INBOUND" && <Badge variant="success">INBOUND</Badge>}
                    {m.type === "OUTBOUND" && <Badge variant="secondary">OUTBOUND</Badge>}
                    {m.type === "TRANSFER" && <Badge variant="info">TRANSFER</Badge>}
                    {m.type === "RESERVATION" && <Badge variant="purple">RESERVATION</Badge>}
                    {m.type === "ADJUSTMENT" && <Badge variant="warning">ADJUSTMENT</Badge>}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-xs">
                    {m.quantity}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {m.warehouse}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {m.ref}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(m.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {m.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Demonstration Banner Notice */}
      <div className="p-4 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>StockPilot Phase 1: Foundational Architecture, Multi-Tenant Shell, Flyway DB Migrations & API Gateway Setup.</span>
        </div>
        <span className="font-mono text-[11px]">DEMO DATA SEEDED</span>
      </div>
    </div>
  );
};
