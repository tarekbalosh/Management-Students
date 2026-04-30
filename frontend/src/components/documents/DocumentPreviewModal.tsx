"use client";

import { 
  X, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle,
  FileText,
  Calendar,
  Database,
  User as UserIcon,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  _id: string;
  originalName: string;
  documentType: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export function DocumentPreviewModal({ 
  document, 
  isOpen, 
  onClose,
  onDownload,
  onStatusUpdate
}: { 
  document: Document | null,
  isOpen: boolean,
  onClose: () => void,
  onDownload: (doc: Document) => void,
  onStatusUpdate?: (id: string, status: string, reason?: string) => void
}) {
  if (!isOpen || !document) return null;

  const isImage = document.mimeType.startsWith("image/");
  const isPDF = document.mimeType === "application/pdf";
  const fileUrl = `/api/documents/file/${document._id}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative flex h-full w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
        {/* Main Content: Viewer */}
        <div className="flex-1 bg-slate-100 flex flex-col min-h-0">
          <div className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <FileText className="text-primary-600" size={20} />
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-md">{document.originalName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onDownload(document)} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors">
                <Download size={14} />
                Download
              </button>
              <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            {isImage ? (
              <img src={fileUrl} alt={document.originalName} className="max-w-full max-h-full rounded-lg shadow-lg object-contain" />
            ) : isPDF ? (
              <iframe src={fileUrl} className="h-full w-full rounded-lg border bg-white" title="PDF Preview" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                  <Database size={40} />
                </div>
                <p className="font-bold">Preview not available for this file type.</p>
                <button onClick={() => onDownload(document)} className="text-primary-600 hover:underline">Download to view</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Metadata & Actions */}
        <div className="w-80 border-l bg-white flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</h4>
              <div className="space-y-3">
                <MetaItem label="Type" value={document.documentType.replace("_", " ").toUpperCase()} icon={FileText} />
                <MetaItem label="Size" value={`${(document.size / 1024 / 1024).toFixed(2)} MB`} icon={Database} />
                <MetaItem label="Uploaded" value={new Date(document.createdAt).toLocaleDateString()} icon={Calendar} />
                <MetaItem label="Owner" value="Student Profile" icon={UserIcon} />
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Management</h4>
              <div className="space-y-3">
                <div className={cn(
                  "rounded-2xl p-4 border",
                  document.status === "verified" ? "bg-emerald-50 border-emerald-100 text-emerald-900" :
                  document.status === "rejected" ? "bg-rose-50 border-rose-100 text-rose-900" :
                  "bg-amber-50 border-amber-100 text-amber-900"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {document.status === "verified" ? <CheckCircle size={16} /> : 
                     document.status === "rejected" ? <XCircle size={16} /> : 
                     <Maximize2 size={16} className="animate-pulse" />}
                    <span className="text-xs font-bold uppercase tracking-tight">{document.status}</span>
                  </div>
                  {document.status === "rejected" && (
                    <p className="text-[10px] italic opacity-80 line-clamp-3">"{document.rejectionReason}"</p>
                  )}
                </div>

                {onStatusUpdate && (
                  <div className="flex flex-col gap-2 pt-2">
                    <button 
                      onClick={() => onStatusUpdate(document._id, "verified")}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-100"
                    >
                      <CheckCircle size={14} />
                      Verify Document
                    </button>
                    <button 
                      onClick={() => {
                        const reason = window.prompt("Reason for rejection:");
                        if (reason) onStatusUpdate(document._id, "rejected", reason);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-600 py-2.5 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 active:scale-95"
                    >
                      <XCircle size={14} />
                      Reject Document
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-xs font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
