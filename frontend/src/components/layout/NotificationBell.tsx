"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  Bell, 
  Check, 
  Clock, 
  Trash2, 
  FileText, 
  CreditCard, 
  Plane, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/unread-count');
      return data.data.count;
    },
    refetchInterval: 30000 // Poll every 30s
  });

  // Fetch latest 5 notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', 'latest'],
    queryFn: async () => {
      const { data } = await api.get('/notifications?limit=5');
      return data.data.notifications;
    },
    enabled: isOpen
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'application_status_changed': return <FileText size={16} className="text-blue-500" />;
      case 'payment_received': return <CreditCard size={16} className="text-emerald-500" />;
      case 'visa_appointment_scheduled': return <Plane size={16} className="text-amber-500" />;
      case 'document_missing': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
      >
        <Bell size={20} />
        {unreadData > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
            {unreadData > 9 ? '9+' : unreadData}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h4>
            <button 
              onClick={() => markAllReadMutation.mutate()}
              className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
            {notificationsData?.length > 0 ? (
              notificationsData.map((notif: any) => (
                <div 
                  key={notif._id} 
                  className={cn(
                    "p-6 hover:bg-slate-50/50 transition-all group relative cursor-pointer",
                    !notif.isRead && "bg-primary-50/10"
                  )}
                  onClick={() => !notif.isRead && markReadMutation.mutate(notif._id)}
                >
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs leading-snug mb-1", notif.isRead ? "text-slate-500 font-medium" : "text-slate-900 font-bold")}>
                        {notif.title}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Clock size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          {formatDistanceToNow(new Date(notif.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary-600 flex-shrink-0 mt-2 shadow-sm shadow-primary-200" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Bell size={32} className="mx-auto text-slate-100 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your inbox is empty</p>
              </div>
            )}
          </div>

          <Link 
            href="/notifications" 
            onClick={() => setIsOpen(false)}
            className="block p-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-50 hover:bg-slate-50 hover:text-primary-600 transition-all bg-slate-50/50"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
