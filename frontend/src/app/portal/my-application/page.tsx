"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyApplicationPage() {
  const { data: portalData, isLoading } = useQuery({
    queryKey: ["portal-dashboard"], // Reuse dashboard query for application info
    queryFn: async () => {
      const { data } = await api.get("/portal/dashboard");
      return data.data;
    }
  });

  const { data: documentsData } = useQuery({
    queryKey: ["portal-documents"],
    queryFn: async () => {
      const { data } = await api.get("/portal/documents");
      return data.data.documents;
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Application Details...</div>;

  const { application } = portalData;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'rejected': return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">My Application</h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Reference: {application?._id?.slice(-8).toUpperCase()}</p>
        </div>
        {application?.status === 'accepted' && (
          <button className="bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary-200 hover:scale-105 transition-all">
            <Download size={18} /> Download Offer Letter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Application Details */}
           <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                 <FileText size={150} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">University</label>
                    <p className="text-xl font-black text-slate-900">{application?.universityId?.name}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Program</label>
                    <p className="text-xl font-black text-slate-900">{application?.programName}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Intake</label>
                    <p className="text-xl font-black text-slate-900">{application?.intake}</p>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Submission Date</label>
                    <p className="text-xl font-black text-slate-900">{new Date(application?.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>
           </div>

           {/* Documents Checklist */}
           <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Required Documents</h4>
              <div className="divide-y divide-slate-50">
                 {documentsData?.map((doc: any) => (
                   <div key={doc._id} className="py-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-12 w-12 rounded-xl flex items-center justify-center border transition-colors",
                           doc.status === 'verified' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
                         )}>
                            {doc.status === 'verified' ? <CheckCircle size={20} /> : <FileText size={20} />}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{doc.type?.replace('_', ' ')}</p>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                              getStatusStyle(doc.status)
                            )}>
                              {doc.status}
                            </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {doc.status === 'rejected' && (
                           <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100">
                             Re-upload
                           </button>
                         )}
                         <a href={doc.fileUrl} target="_blank" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
                           <ExternalLink size={18} />
                         </a>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm h-fit">
           <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
              <Clock size={20} className="text-primary-600" />
              Timeline
           </h4>
           <div className="space-y-10 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {application?.statusHistory?.length > 0 ? application.statusHistory.map((h: any, i: number) => (
                <div key={i} className="flex gap-6 relative">
                   <div className="h-10 w-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-primary-600 z-10 shadow-sm">
                      <CheckCircle size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{h.status?.replace('_', ' ')}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(h.changedAt).toLocaleDateString()}</p>
                   </div>
                </div>
              )) : (
                <div className="flex gap-6 relative">
                   <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white z-10 shadow-lg shadow-primary-100">
                      <CheckCircle size={18} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Application Submitted</p>
                      <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">Active Status</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
