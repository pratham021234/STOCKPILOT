import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  Boxes,
  ArrowLeftRight,
  Truck,
  Users,
  ShoppingCart,
  FileCheck2,
  Receipt,
  RotateCcw,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  ChevronRight,
  Boxes as LogoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: "Core Inventory",
    items: [
      { name: "Overview", href: "/", icon: LayoutDashboard },
      { name: "Products", href: "/products", icon: Package },
      { name: "Categories", href: "/categories", icon: Layers },
      { name: "Warehouses", href: "/warehouses", icon: Warehouse },
      { name: "Inventory", href: "/inventory", icon: Boxes },
    ],
  },
  {
    title: "Operations & Movement",
    items: [
      { name: "Stock Movements", href: "/stock-movements", icon: ArrowLeftRight },
      { name: "Stock Transfers", href: "/stock-transfers", icon: Truck },
      { name: "Suppliers", href: "/suppliers", icon: Users },
      { name: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
      { name: "Goods Receipts", href: "/goods-receipts", icon: FileCheck2 },
      { name: "Sales Orders", href: "/sales-orders", icon: Receipt },
      { name: "Returns", href: "/returns", icon: RotateCcw },
    ],
  },
  {
    title: "Intelligence & Settings",
    items: [
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
      { name: "Team & Roles", href: "/team", icon: ShieldCheck },
      { name: "Organization Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0b1120] text-slate-300 border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand / Logo Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-900/30">
              <LogoIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                StockPilot
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Enterprise
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Organization Tenant Switcher Placeholder */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Active Tenant
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-semibold text-slate-200 truncate">
              Acme Logistics & Retail
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-blue-500/30 text-blue-300 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>v1.0.0-phase1</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Core Online
          </span>
        </div>
      </aside>
    </>
  );
};

