import React from "react";
import { Menu, Search, Bell, Activity, Database, CheckCircle2, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchHealthStatus } from "@/services/api";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { data: health, isError, isLoading } = useQuery({
    queryKey: ["systemHealth"],
    queryFn: fetchHealthStatus,
    refetchInterval: 15000, // Refresh health status every 15s
    retry: 1,
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-72 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, batch, order or warehouse... (Ctrl + K)"
            className="w-full h-9 pl-9 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend & DB Health Indicator Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-slate-50 border-slate-200">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-600">Backend:</span>
          {isLoading ? (
            <span className="text-slate-400 animate-pulse">Checking...</span>
          ) : isError ? (
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Offline
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {health?.status === 'UP' ? 'Online' : 'Degraded'}
            </span>
          )}

          {health?.components?.database && (
            <span className="flex items-center gap-1 pl-1 border-l border-slate-300 text-slate-500">
              <Database className="w-3 h-3 text-slate-400" />
              <span className={health.components.database.status === 'UP' ? 'text-emerald-600 font-medium' : 'text-red-500'}>
                PostgreSQL
              </span>
            </span>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          className="relative p-2 text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Profile Placeholder */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
            SJ
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">Sarah Jenkins</div>
            <div className="text-[11px] text-slate-500 leading-tight">Warehouse Lead Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
