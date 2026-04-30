"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  Bell, 
  CheckCircle,
  FileText,
  CreditCard,
  Plane,
  AlertCircle,
  Clock,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function PortalNotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", "portal-list"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data.data.notifications;
    }
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/notifications/${id}/read`),
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
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Notifications</h1>
        <button 
          onClick={() => api.patch('/notifications/read-all').then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }))}
          className="text-xs font-black text-primary-600 uppercase tracking-widest hover:bg-primary-50 px-6 py-3 rounded-2xl transition-all"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
        {isLoading ? (
          <div className="p-20 text-center animate-pulse">Updating Inbox...</div>
        ) : notifications?.length > 0 ? (
          notifications.map((notif: any) => (
            <div 
              key={notif._id}
              className={cn(
                "p-8 hover:bg-slate-50/50 transition-all flex items-start gap-8 relative",
                !notif.isRead && "bg-primary-50/5"
              )}
            >
              <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={cn("text-base font-black", notif.isRead ? "text-slate-500" : "text-slate-900")}>
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
                
                {!notif.isRead && (
                  <button 
                    onClick={() => markReadMutation.mutate(notif._id)}
                    className="mt-4 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>

              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600" />
              )}
            </div>
          ))
        ) : (
          <div className="p-32 text-center">
            <Bell size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your inbox is clean</p>
          </div>
        )}
      </div>
    </div>
  );
}
