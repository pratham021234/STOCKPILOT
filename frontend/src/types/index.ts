export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiError[];
  timestamp: string;
}

export interface ApiError {
  field?: string;
  rejectedValue?: unknown;
  message: string;
  code?: string;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  appName: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  components: {
    database?: {
      status: string;
      type?: string;
      catalog?: string;
      error?: string;
    };
    [key: string]: unknown;
  };
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  badge?: string | number;
  category: 'core' | 'operations' | 'analytics' | 'settings';
}

export interface StockMovementSummary {
  id: string;
  sku: string;
  productName: string;
  movementType: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT' | 'RESERVATION';
  quantity: number;
  referenceDoc: string;
  warehouseName: string;
  timestamp: string;
  performedBy: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalInventoryValue: number;
  totalWarehouses: number;
  lowStockAlerts: number;
  pendingPurchaseOrders: number;
  pendingSalesOrders: number;
}

