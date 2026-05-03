import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">{title}</h1>
        {subtitle && <p className="text-sm font-bold text-slate-400 tracking-tight">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
