"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { VisaStatsSection } from "@/components/visa/VisaStatsSection";
import { Loader2, ShieldCheck, Plane } from "lucide-react";

const fetchVisaStats = async () => {
  const { data } = await api.get("/visa/stats");
  return data.data;
};

export default function VisaDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["visa-stats"],
    queryFn: fetchVisaStats
  });

  if (isLoading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-primary-600 animate-spin" />
        <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600" size={24} />
      </div>
      <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Loading Global Stats...</p>
    </div>
  );

  if (error || !stats) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500">
        <ShieldCheck size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900 uppercase">Stats Unavailable</h3>
        <p className="text-slate-500 max-w-xs mx-auto">We couldn't retrieve the visa statistics. Please try again later or contact support.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Visa Intelligence" 
        subtitle="Monitor approval rates, processing times, and university-specific performance."
      />

      <VisaStatsSection stats={stats} />
      
      {/* Additional Section: Recent Updates or Trends */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 blur-[100px] rounded-full translate-x-1/2" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="bg-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-primary-500/30">
              Insight of the Month
            </span>
            <h3 className="text-4xl font-black mt-6 leading-tight">
              Biometric scheduling is the current <span className="text-primary-400 underline decoration-primary-500/50">bottleneck</span>.
            </h3>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
              Applications submitted on Tuesdays have shown a 12% faster turnaround time for biometric appointments compared to Friday submissions.
            </p>
            <button className="mt-8 px-8 py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-primary-50 transition-all shadow-xl shadow-white/5">
              Download Full Report
            </button>
          </div>
          <div className="hidden lg:block relative h-64 bg-slate-800/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm p-8">
             <div className="flex flex-col h-full justify-between">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500" style={{ width: `${Math.random() * 60 + 30}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

