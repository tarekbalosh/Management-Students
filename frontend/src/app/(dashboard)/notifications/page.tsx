"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle,
  FileText,
  CreditCard,
  Plane,
  AlertCircle,
  Clock,
  MoreVertical
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    isRead: "",
    type: "",
  });

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", "full-list", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.isRead) params.append('isRead', filter.isRead);
      if (filter.type) params.append('type', filter.type);
      const { data } = await api.get(`/notifications?${params.toString()}`);
      return data.data.notifications;
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/notifications/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'application_status_changed': return <FileText size={20} className="text-blue-500" />;
      case 'payment_received': return <CreditCard size={20} className="text-emerald-500" />;
      case 'visa_appointment_scheduled': return <Plane size={20} className="text-amber-500" />;
      case 'document_missing': return <AlertCircle size={20} className="text-rose-500" />;
      default: return <Bell size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Notifications" 
          subtitle="Stay updated with your applications, documents, and payments."
        />
        <button 
          onClick={() => markAllReadMutation.mutate()}
          className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
        >
          <CheckCircle size={16} />
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex-1 flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
           <Filter size={18} className="text-slate-400" />
           <select 
             className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-slate-600 cursor-pointer"
             onChange={(e) => setFilter({ ...filter, isRead: e.target.value })}
           >
             <option value="">All Status</option>
             <option value="false">Unread</option>
             <option value="true">Read</option>
           </select>
           <div className="h-4 w-[1px] bg-slate-200" />
           <select 
             className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-slate-600 cursor-pointer"
             onChange={(e) => setFilter({ ...filter, type: e.target.value })}
           >
             <option value="">All Types</option>
             <option value="application_status_changed">Applications</option>
             <option value="payment_received">Payments</option>
             <option value="visa_appointment_scheduled">Visa</option>
             <option value="document_missing">Documents</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse">
            <Bell className="mx-auto text-slate-100 mb-4 animate-bounce" size={48} />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Updating your inbox...</p>
          </div>
        ) : notificationsData?.length > 0 ? (
          notificationsData.map((notif: any) => (
            <div 
              key={notif._id}
              className={cn(
                "p-8 hover:bg-slate-50/50 transition-all flex items-start gap-8 group relative",
                !notif.isRead && "bg-primary-50/5"
              )}
            >
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn("text-base", notif.isRead ? "text-slate-500 font-medium" : "text-slate-900 font-black")}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(notif.createdAt))} ago
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                  {notif.message}
                </p>
                
                <div className="flex items-center gap-4 mt-6">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markReadMutation.mutate(notif._id)}
                      className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:bg-primary-50 px-3 py-1 rounded-lg transition-all"
                    >
                      Mark Read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMutation.mutate(notif._id)}
                    className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-all flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>

              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600" />
              )}
            </div>
          ))
        ) : (
          <div className="p-32 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Clean Inbox</h3>
            <p className="text-sm text-slate-400 font-medium">You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
