import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-50 text-indigo-600 border-indigo-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    danger: "bg-rose-50 text-rose-600 border-rose-100",
    outline: "border-2 border-slate-100 text-slate-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
