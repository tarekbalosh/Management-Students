"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  GraduationCap, 
  FileCheck, 
  Plane, 
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PortalDashboard() {
  const { data: portalData, isLoading } = useQuery({
    queryKey: ["portal-dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/portal/dashboard");
      return data.data;
    }
  });

  if (isLoading) return <div className="animate-pulse space-y-8">
    <div className="h-32 bg-white rounded-[2.5rem]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-48 bg-white rounded-[2rem]" />
      <div className="h-48 bg-white rounded-[2rem]" />
      <div className="h-48 bg-white rounded-[2rem]" />
    </div>
  </div>;

  const { student, application, visa, docStats, recentNotifications } = portalData;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <GraduationCap size={200} />
         </div>
         <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Welcome back, <br className="md:hidden" />
              <span className="text-primary-400">{student?.firstName} {student?.lastName}</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              Track your journey to studying abroad. Here is what's happening with your application.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Status Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative group overflow-hidden">
           <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current Application</p>
                <h3 className="text-2xl font-black text-slate-900">{application?.universityId?.name || "No Active Application"}</h3>
                <p className="text-slate-500 font-bold">{application?.programName}</p>
              </div>
              <div className={cn(
                "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                application?.status === 'accepted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-primary-50 text-primary-600 border-primary-100"
              )}>
                {application?.status?.replace('_', ' ') || "N/A"}
              </div>
           </div>

           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrollment Goal</span>
                 <span className="text-xs font-black text-slate-900">{application?.intake || "September 2026"}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                 <div className="bg-primary-600 h-full w-[65%]" />
              </div>
           </div>

           <Link href="/portal/my-application" className="mt-8 flex items-center gap-2 text-xs font-black text-primary-600 uppercase tracking-widest group-hover:gap-4 transition-all">
              View Application Details <ArrowRight size={16} />
           </Link>
        </div>

        {/* Document Meter */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="relative h-32 w-32 flex items-center justify-center mb-6">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * (docStats?.verified / (docStats?.total || 1)))} className="text-primary-600 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{docStats?.verified}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">of {docStats?.total} Docs</span>
              </div>
           </div>
           <h4 className="text-lg font-black text-slate-900 mb-2">Documents Verified</h4>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
             {docStats?.total - docStats?.verified} more documents need verification
           </p>
           <Link href="/portal/documents" className="mt-6 text-xs font-black text-slate-900 hover:text-primary-600 transition-colors uppercase tracking-widest flex items-center gap-2">
              <FileCheck size={16} /> Update Docs
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Visa Stage */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
               <Plane size={24} className="text-primary-600" />
               Visa Status
            </h4>
            
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
               <div className="flex items-start gap-6 relative">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white z-10 shadow-lg shadow-emerald-100">
                     <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Application Submitted</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Completed on Mar 12, 2026</p>
                  </div>
               </div>
               <div className="flex items-start gap-6 relative">
                  <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white z-10 shadow-lg shadow-primary-100 animate-pulse">
                     <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Embassy Interview</p>
                    <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">In Progress — Expected Apr 25</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Recent Notifications */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Bell size={24} className="text-primary-600" />
                Recent Updates
              </h4>
              <Link href="/portal/notifications" className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">View All</Link>
            </div>
            
            <div className="space-y-4">
               {recentNotifications?.length > 0 ? recentNotifications.map((notif: any) => (
                 <div key={notif._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
                       <AlertCircle size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-slate-900 line-clamp-1">{notif.title}</p>
                       <p className="text-[10px] text-slate-500 font-medium mb-2">{notif.message}</p>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(notif.createdAt), 'MMM dd, HH:mm')}</span>
                    </div>
                 </div>
               )) : (
                 <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">No recent notifications</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
