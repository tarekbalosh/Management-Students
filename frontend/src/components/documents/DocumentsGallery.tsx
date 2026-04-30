"use client";

import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  MoreVertical, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle,
  LayoutGrid,
  List as ListIcon,
  Search,
  Calendar
} from "lucide-react";
import { useState } from "react";
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

export function DocumentsGallery({ 
  documents, 
  onPreview, 
  onDownload, 
  onDelete, 
  onStatusUpdate 
}: { 
  documents: Document[],
  onPreview: (doc: Document) => void,
  onDownload: (doc: Document) => void,
  onDelete: (id: string) => void,
  onStatusUpdate?: (id: string, status: string, reason?: string) => void
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filteredDocs = documents.filter(d => 
    d.originalName.toLowerCase().includes(search.toLowerCase()) ||
    d.documentType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Filter documents..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center rounded-lg border bg-white p-1 shadow-sm">
          <button 
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded-md transition-all", view === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded-md transition-all", view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((doc) => (
            <div key={doc._id} className="group flex flex-col bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md overflow-hidden">
              <div className="h-40 bg-slate-50 flex items-center justify-center border-b relative">
                <FileText size={48} className="text-slate-200 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg border p-1 shadow-sm">
                    <button onClick={() => onPreview(doc)} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-md">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => onDownload(doc)} className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 truncate">{doc.originalName}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.documentType.replace("_", " ")}</span>
                    <span className="text-[10px] text-slate-400">{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <Badge variant={doc.status === "verified" ? "success" : doc.status === "rejected" ? "danger" : "warning"}>
                    {doc.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {doc.status === "rejected" && doc.rejectionReason && (
                  <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                    <p className="text-[10px] text-rose-600 font-medium leading-relaxed italic">
                      " {doc.rejectionReason} "
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc._id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <span className="font-medium text-slate-900 truncate max-w-[200px]">{doc.originalName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{doc.documentType.replace("_", " ")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={doc.status === "verified" ? "success" : doc.status === "rejected" ? "danger" : "warning"}>
                      {doc.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onPreview(doc)} className="p-2 text-slate-400 hover:text-primary-600">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onDelete(doc._id)} className="p-2 text-slate-400 hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
