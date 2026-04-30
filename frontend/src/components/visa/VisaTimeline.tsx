"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Calendar, 
  Users, 
  Check, 
  X,
  Plane,
  Info,
  MapPin,
  ClipboardCheck,
  Flag
} from "lucide-react";
import { VisaStage, StageHistoryEntry } from "@/types/visa";

const STAGES: { id: VisaStage; label: string; icon: any; description: string }[] = [
  { id: 'documents_preparation', label: 'Documents Preparation', icon: FileText, description: 'Gathering required visa documents' },
  { id: 'documents_submitted', label: 'Documents Submitted', icon: ClipboardCheck, description: 'Documents submitted to embassy' },
  { id: 'embassy_appointment', label: 'Embassy Appointment', icon: Calendar, description: 'Appointment scheduled' },
  { id: 'interview_completed', label: 'Interview Completed', icon: Users, description: 'Interview done' },
  { id: 'visa_approved', label: 'Visa Approved', icon: Plane, description: 'Visa granted' },
  { id: 'visa_rejected', label: 'Visa Rejected', icon: X, description: 'Application rejected' },
  { id: 'visa_collected', label: 'Visa Collected', icon: Flag, description: 'Physical visa collected' },
];

interface VisaTimelineProps {
  currentStage: VisaStage;
  history: StageHistoryEntry[];
}

export function VisaTimeline({ currentStage, history }: VisaTimelineProps) {
  const [selectedStage, setSelectedStage] = useState<StageHistoryEntry | null>(null);
  const currentIdx = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="relative">
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />
      
      <div className="space-y-8 relative">
        {STAGES.map((stage, i) => {
          const isCompleted = i < currentIdx || (currentStage === 'visa_collected' && i < STAGES.length - 1) || (currentStage === stage.id && i === STAGES.length - 1);
          const isCurrent = currentStage === stage.id && !isCompleted;
          const isFuture = !isCurrent && !isCompleted;
          const historyEntry = history.find(h => h.stage === stage.id);

          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex gap-6 group">
              {/* Timeline Indicator */}
              <div className="relative flex flex-col items-center">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10 bg-white",
                  isCompleted ? "border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-50" :
                  isCurrent ? "border-primary-600 text-primary-600 shadow-xl shadow-primary-50 animate-pulse" :
                  "border-slate-100 text-slate-300"
                )}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                </div>
              </div>

              {/* Content Card */}
              <div 
                onClick={() => historyEntry && setSelectedStage(historyEntry)}
                className={cn(
                  "flex-1 rounded-3xl border p-6 transition-all duration-300 cursor-pointer",
                  isCurrent ? "bg-white shadow-xl shadow-slate-200/50 border-primary-100 scale-[1.02]" : 
                  isCompleted ? "bg-emerald-50/10 border-emerald-50 hover:border-emerald-200" : 
                  "bg-slate-50/50 border-transparent opacity-60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={cn("font-black text-sm uppercase tracking-tight", isFuture ? "text-slate-400" : "text-slate-900")}>
                      {stage.label}
                    </h4>
                    <p className="text-xs text-slate-500">{stage.description}</p>
                  </div>
                  {isCompleted && (
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  {isCurrent && (
                    <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping" />
                  )}
                </div>

                {historyEntry && (
                  <div className="mt-4 flex items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(historyEntry.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    {historyEntry.notes && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">
                        <Info size={10} />
                        View Details
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Overlay (Simple implementation of "popup") */}
      {selectedStage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Stage Details</h3>
                <p className="text-sm text-primary-600 font-bold">{selectedStage.stage.replace('_', ' ')}</p>
              </div>
              <button onClick={() => setSelectedStage(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedStage.notes && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</p>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{selectedStage.notes}</p>
                </div>
              )}

              {selectedStage.appointmentDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(selectedStage.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-slate-900">{selectedStage.appointmentLocation}</p>
                  </div>
                </div>
              )}

              {selectedStage.visaNumber && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Visa Issued</p>
                  <p className="text-lg font-black text-emerald-900">{selectedStage.visaNumber}</p>
                  <div className="mt-2 text-xs text-emerald-700 flex gap-4">
                    <span>From: {new Date(selectedStage.validFrom!).toLocaleDateString()}</span>
                    <span>To: {new Date(selectedStage.validTo!).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {selectedStage.rejectionReason && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Rejection Reason</p>
                  <p className="text-sm font-bold text-red-900">{selectedStage.rejectionReason}</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSelectedStage(null)}
              className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

