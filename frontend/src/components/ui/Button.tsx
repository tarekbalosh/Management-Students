import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-indigo active:scale-95",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 active:scale-95",
    outline: "bg-white border-2 border-slate-100 text-slate-600 hover:border-slate-900",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-bold",
    md: "px-6 py-3 text-sm font-black uppercase tracking-widest",
    lg: "px-8 py-4 text-base font-black uppercase tracking-widest",
    icon: "p-2",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
