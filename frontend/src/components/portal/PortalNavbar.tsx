"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FileCheck, 
  Plane, 
  CreditCard, 
  Bell,
  User,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';

export function PortalNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/my-application', label: 'My Application', icon: FileText },
    { href: '/portal/documents', label: 'Documents', icon: FileCheck },
    { href: '/portal/visa', label: 'Visa Tracking', icon: Plane },
    { href: '/portal/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/portal/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                <GraduationCap size={24} />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight hidden sm:block">STUDENT MANAGEMENT</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    pathname === link.href 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all group">
              <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-white transition-all overflow-hidden">
                <User size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links (Scrolling) */}
      <div className="md:hidden flex overflow-x-auto px-4 py-3 gap-2 border-t border-slate-50 no-scrollbar">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
              pathname === link.href 
                ? "bg-primary-600 text-white" 
                : "bg-slate-50 text-slate-400"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
