"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { VisaTimeline } from "@/components/visa/VisaTimeline";
import { StageUpdateModal } from "@/components/visa/StageUpdateModal";
import { EmbassyAppointmentCard } from "@/components/visa/EmbassyAppointmentCard";
import { 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  User as UserIcon,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  Bell
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { VisaTracking, VisaStage } from "@/types/visa";

const fetchVisaRecord = async (applicationId: string) => {
  const { data } = await api.get(`/visa/${applicationId}`);
  return data.data.visa;
};

const fetchApplication = async (id: string) => {
  const { data } = await api.get(`/applications/${id}`);
  return data.data.application;
};

export default function ApplicationVisaPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const applicationId = params.id;
  const queryClient = useQueryClient();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { data: visa, isLoading, error } = useQuery<VisaTracking>({
    queryKey: ["visa", applicationId],
    queryFn: () => fetchVisaRecord(applicationId),
    retry: false
  });

  const { data: application } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => fetchApplication(applicationId)
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      if (!application) return;
      const { data } = await api.post("/visa", {
        applicationId,
        studentId: application.studentId._id || application.studentId,
        currentStage: "documents_preparation"
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa", applicationId] });
    }
  });

  const updateStageMutation = useMutation({
    mutationFn: async (stageData: any) => {
      if (!visa) return;
      const { data } = await api.patch(`/visa/${visa._id}/stage`, stageData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa", applicationId] });
    }
  });

  const addReminderMutation = useMutation({
    mutationFn: async (reminderData: any) => {
      if (!visa) return;
      const { data } = await api.post(`/visa/${visa._id}/reminder`, reminderData);
      return data;
    }
  });

  if (isLoading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary-600" size={40} />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Tracking Record...</p>
    </div>
  );

  if (error || !visa) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center max-w-md mx-auto">
      <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
        <ShieldCheck size={40} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Tracking Not Initialized</h3>
        <p className="text-slate-500 leading-relaxed">This application doesn't have a visa tracking record yet. Start tracking to manage stages and appointments.</p>
      </div>
      <button 
        disabled={initializeMutation.isPending}
        className="group relative flex items-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary-100 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
        onClick={() => initializeMutation.mutate()}
      >
        {initializeMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
        INITIALIZE VISA TRACKING
      </button>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/applications/${applicationId}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} />
        Back to Application
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between bg-white p-10 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-100/50">
        <div className="flex items-center gap-8">
          <div className="h-20 w-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
            <ShieldCheck size={40} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Visa Tracking</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
            <p className="text-slate-500 font-bold flex items-center gap-2">
              <FileText size={16} className="text-slate-300" />
              Reference ID: {applicationId.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-slate-200 transition-all hover:bg-slate-800 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={18} />
            UPDATE STAGE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Timeline Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Active Appointment Alert */}
          {visa.embassyDetails?.appointmentDate && (
            <EmbassyAppointmentCard 
              appointmentDate={visa.embassyDetails.appointmentDate}
              location={visa.embassyDetails.address || "TBD"}
              embassyName={visa.embassyDetails.name || "Consulate General"}
              onToggleReminder={(active) => {
                if (active) {
                  addReminderMutation.mutate({
                    type: 'appointment',
                    scheduledFor: visa.embassyDetails.appointmentDate
                  });
                }
              }}
            />
          )}

          <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-12 shadow-xl shadow-slate-100/20">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Application Journey</h3>
              <div className="flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                <Clock size={14} />
                Real-time tracking
              </div>
            </div>
            <VisaTimeline currentStage={visa.currentStage} history={visa.stageHistory} />
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="space-y-8">
          {/* Quick Stats Sidebar Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
             <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</p>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <h4 className="text-xl font-black uppercase mb-2 leading-tight">
               {visa.currentStage.replace('_', ' ')}
             </h4>
             <p className="text-slate-400 text-xs leading-relaxed">
               Last updated {new Date(visa.updatedAt).toLocaleDateString()} by System Admin
             </p>
             <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Reminders</span>
                   <span className="text-xs text-emerald-400 font-black">{visa.reminders.length} Active</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Docs</span>
                   <span className="text-xs text-primary-400 font-black">{visa.attachments.length} Files</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-10 shadow-xl shadow-slate-100/20 space-y-8">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm border-b-2 border-slate-50 pb-6">Student Dossier</h4>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-100/50">
              <div className="h-14 w-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 tracking-tight">{visa.studentId?.firstName} {visa.studentId?.lastName}</p>
                <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{visa.studentId?.nationality}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
               <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                     <Bell size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Push Notifications</p>
                    <p className="text-[10px] text-slate-400 font-bold">Enabled for this student</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                     <CheckCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Docs Verified</p>
                    <p className="text-[10px] text-slate-400 font-bold">All mandatory files present</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <StageUpdateModal 
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        currentStage={visa.currentStage}
        onSubmit={(data) => updateStageMutation.mutate(data)}
      />
    </div>
  );
}

