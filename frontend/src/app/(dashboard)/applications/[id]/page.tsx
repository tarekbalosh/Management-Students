"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/Badge";
import { 
  Building, 
  User as UserIcon, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ExternalLink,
  MessageSquare,
  Upload
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const fetchApplication = async (id: string) => {
  const { data } = await api.get(`/applications/${id}`);
  return data.data;
};

export default function ApplicationDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const id = params.id;
  const queryClient = useQueryClient();
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => fetchApplication(id),
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => api.patch(`/applications/${id}/status`, { status: newStatus, notes: "Status updated from detail page" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      setIsChangingStatus(false);
    }
  });

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Status Control */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <Building size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{app.universityId?.name}</h1>
              <Badge variant="default" className="text-xs uppercase tracking-widest">{app.status.replace("_", " ")}</Badge>
            </div>
            <p className="text-slate-500 font-medium">{app.programId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsChangingStatus(!isChangingStatus)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
            >
              Update Status
              <ChevronRight size={16} className={cn("transition-transform", isChangingStatus && "rotate-90")} />
            </button>
            
            {isChangingStatus && (
              <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                {['submitted', 'under_review', 'conditional', 'accepted', 'rejected'].map(s => (
                  <button 
                    key={s}
                    onClick={() => statusMutation.mutate(s)}
                    className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                  >
                    Mark as {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                <UserIcon size={18} className="text-primary-600" />
                Student Profile
              </h3>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
                <p className="text-sm font-bold text-slate-900">{app.studentId?.firstName} {app.studentId?.lastName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Nationality</p>
                <p className="text-sm font-medium text-slate-700">{app.studentId?.nationality}</p>
              </div>
              <Link 
                href={`/students/${app.studentId?._id}`}
                className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:underline pt-2"
              >
                View Full Profile <ExternalLink size={12} />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" />
                Intake Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Semester</p>
                  <p className="text-sm font-bold text-slate-900">{app.intake.semester}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Year</p>
                  <p className="text-sm font-bold text-slate-900">{app.intake.year}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted On</p>
                <p className="text-sm font-medium text-slate-700">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Pending"}</p>
              </div>
            </div>
          </div>

          {/* Document Checklist */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-primary-600" />
                Document Checklist
              </h3>
              <span className="text-xs text-slate-500 font-medium">3 / 5 Verified</span>
            </div>
            
            <div className="space-y-3">
              {['Passport', 'Degree Certificate', 'IELTS Score', 'Statement of Purpose', 'CV'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    {i < 3 ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-slate-300" />}
                    <span className="text-sm font-semibold text-slate-700">{doc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={i < 3 ? "success" : "outline"}>{i < 3 ? "VERIFIED" : "PENDING"}</Badge>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-primary-600 transition-all">
                      <Upload size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status History Timeline */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Clock size={20} className="text-primary-600" />
            Status History
          </h3>
          
          <div className="space-y-8 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
            
            {app.statusHistory?.map((entry: any, i: number) => (
              <div key={i} className="relative pl-10">
                <div className="absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary-500 shadow-sm ring-4 ring-primary-50" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-tight text-slate-900">
                      {entry.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(entry.changedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{entry.notes || "No notes provided"}</p>
                  <p className="text-[10px] font-medium text-slate-400 italic">by {entry.changedBy?.firstName}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Internal Notes</h4>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-900 flex gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                Student needs to provide updated bank statement before visa filing.
              </p>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-xs font-bold text-slate-400 hover:border-primary-200 hover:text-primary-600 transition-all">
              <MessageSquare size={14} />
              Add Internal Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
