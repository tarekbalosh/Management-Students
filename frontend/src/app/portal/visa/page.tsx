"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  Plane, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortalVisaPage() {
  const { data: visaData, isLoading } = useQuery({
    queryKey: ["portal-visa"],
    queryFn: async () => {
      const { data } = await api.get("/portal/visa");
      return data.data.visa;
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Visa Tracking...</div>;

  const steps = [
    { key: 'offer_letter', label: 'Offer Letter Received' },
    { key: 'fee_payment', label: 'Tuition Fee Payment' },
    { key: 'cas_issued', label: 'CAS / I-20 Issued' },
    { key: 'visa_applied', label: 'Visa Applied' },
    { key: 'biometrics', label: 'Biometrics Completed' },
    { key: 'interview', label: 'Embassy Interview' },
    { key: 'passport_submission', label: 'Passport Submitted' },
    { key: 'visa_granted', label: 'Visa Granted' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === visaData?.currentStage) || 0;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Visa Tracking</h1>
        <p className="text-slate-500 font-bold text-sm mt-2">Monitor your visa application progress in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Progress Timeline */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
           <div className="space-y-12 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-50">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex gap-8 relative">
                     <div className={cn(
                       "h-12 w-12 rounded-2xl flex items-center justify-center z-10 transition-all border-4 border-white",
                       isCompleted ? "bg-emerald-500 text-white" : isCurrent ? "bg-primary-600 text-white shadow-xl shadow-primary-200 animate-pulse" : "bg-slate-100 text-slate-300"
                     )}>
                        {isCompleted ? <CheckCircle2 size={24} /> : <div className="font-black text-lg">{index + 1}</div>}
                     </div>
                     <div className="flex-1 pt-1">
                        <h4 className={cn(
                          "text-lg font-black uppercase tracking-tight",
                          isCurrent ? "text-slate-900" : isCompleted ? "text-slate-500" : "text-slate-300"
                        )}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <div className="mt-4 p-5 bg-primary-50 rounded-2xl border border-primary-100">
                             <p className="text-xs text-primary-700 font-bold leading-relaxed">
                               Your application is currently at this stage. We are preparing the necessary documents for your submission.
                             </p>
                          </div>
                        )}
                     </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Embassy Details */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200">
              <h4 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                 <Calendar size={24} className="text-primary-400" />
                 Appointment
              </h4>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                    <div className="flex items-center gap-3">
                       <MapPin size={20} className="text-primary-400" />
                       <span className="text-sm font-bold">{visaData?.location || "US Embassy, London"}</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date & Time</label>
                    <div className="flex items-center gap-3">
                       <Clock size={20} className="text-primary-400" />
                       <span className="text-sm font-bold">{visaData?.appointmentDate ? new Date(visaData.appointmentDate).toLocaleString() : "TBD"}</span>
                    </div>
                 </div>
                 
                 <button className="w-full mt-4 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors">
                    Add to Calendar
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                 <AlertCircle size={24} className="text-primary-600" />
                 Travel Tips
              </h4>
              <ul className="space-y-4">
                 <li className="flex items-start gap-3 text-xs text-slate-500 font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-600 mt-1.5 flex-shrink-0" />
                    Carry your original documents for the interview.
                 </li>
                 <li className="flex items-start gap-3 text-xs text-slate-500 font-medium">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-600 mt-1.5 flex-shrink-0" />
                    Arrive at least 30 minutes before your scheduled slot.
                 </li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
