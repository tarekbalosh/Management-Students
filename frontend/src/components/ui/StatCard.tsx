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
    <div className={cn(
      "relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-soft transition-all hover:shadow-indigo group",
      className
    )}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-32 w-32 bg-primary-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 border border-slate-100 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            <Icon size={28} />
          </div>
          {trend && (
            <div
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border",
                trend.isUp 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border-rose-100"
              )}
            >
              {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
      </div>
    </div>
  );
}
