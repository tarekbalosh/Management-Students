"use client";

import { Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const currentPage = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-slate-400">Pages</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900">{currentPage}</span>
      </div>

      {/* Center: Search */}
      <div className="hidden max-w-md flex-1 px-4 sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students, universities..."
            className="h-10 w-full rounded-lg border-none bg-slate-100 pl-10 pr-4 text-sm outline-none ring-primary-500 transition-all focus:ring-2"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        
        <div className="h-6 w-[1px] bg-slate-200" />
        
        <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}
