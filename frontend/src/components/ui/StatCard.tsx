import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isUp ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-1 text-2xl font-semibold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}
