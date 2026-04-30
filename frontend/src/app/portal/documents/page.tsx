"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  FileCheck, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  FileSearch,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortalDocumentsPage() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ["portal-documents"],
    queryFn: async () => {
      const { data } = await api.get("/portal/documents");
      return data.data.documents;
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Documents...</div>;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest"><CheckCircle size={14} /> Verified</div>;
      case 'rejected': return <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-xl border border-rose-100 text-[10px] font-black uppercase tracking-widest"><AlertCircle size={14} /> Rejected</div>;
      default: return <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-xl border border-amber-100 text-[10px] font-black uppercase tracking-widest"><Clock size={14} /> Pending</div>;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Documents</h1>
           <p className="text-slate-500 font-bold text-sm mt-2">Manage your academic and personal documentation.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-200">
           <Plus size={18} /> Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents?.map((doc: any) => (
          <div key={doc._id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm group hover:border-primary-200 transition-all">
             <div className="flex items-start justify-between mb-8">
                <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                   <FileSearch size={32} />
                </div>
                {getStatusBadge(doc.status)}
             </div>

             <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{doc.type?.replace('_', ' ')}</h4>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>

             {doc.status === 'rejected' && (
               <div className="mb-8 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <XCircle size={12} /> Reason for Rejection:
                  </p>
                  <p className="text-[10px] text-rose-500 font-medium leading-relaxed">{doc.rejectionReason || "Please provide a clearer scan of the document."}</p>
                  <button className="mt-4 w-full bg-rose-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Try Again
                  </button>
               </div>
             )}

             <a 
               href={doc.fileUrl} 
               target="_blank" 
               className="block text-center py-4 rounded-2xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all"
             >
               View Document
             </a>
          </div>
        ))}

        {/* Empty State / Add New */}
        <div className="bg-slate-50 rounded-[3rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-primary-300 transition-all">
           <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-primary-600 transition-colors mb-4">
              <Upload size={32} />
           </div>
           <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-primary-600">Upload Another Document</p>
        </div>
      </div>
    </div>
  );
}
