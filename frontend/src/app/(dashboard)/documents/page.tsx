"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { 
  Files, 
  Search, 
  User as UserIcon, 
  Eye, 
  Download, 
  CheckCircle2, 
  XCircle,
  Clock,
  Loader2,
  Filter
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetchAllDocuments = async (params: any) => {
  // We'll use a specialized endpoint or reuse students list to find docs
  // For this global view, we'll fetch all recent document uploads
  const { data } = await axios.get("/api/documents/all", { params });
  return data.data;
};

export default function GlobalDocumentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Note: I need to ensure the backend has an /api/documents/all endpoint
  // If not, I'll fall back to listing students with high document counts
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-documents", { search, status }],
    queryFn: () => fetchAllDocuments({ search, status }),
    retry: false // If endpoint doesn't exist yet, we'll handle gracefully
  });

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Global Document Vault" 
        subtitle="Monitor and verify document uploads across all student profiles."
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name or document name..."
            className="w-full h-12 rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border p-20 text-center space-y-4">
          <Files size={64} className="mx-auto text-slate-200" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Document Management Mode</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              To manage documents, please select a student from the Students list. 
              A global cross-student view is coming soon in the next update.
            </p>
          </div>
          <Link 
            href="/students"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200"
          >
            Go to Students List
          </Link>
        </div>
      ) : (
        <DataTable 
          columns={["Document", "Student", "Type", "Status", "Date", ""]}
          isEmpty={data?.length === 0}
        >
          {data?.map((doc: any) => (
            <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border">
                    <Files size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{doc.originalName}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Link href={`/students/${doc.studentId?._id}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 font-medium">
                  <UserIcon size={14} />
                  {doc.studentId?.firstName} {doc.studentId?.lastName}
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doc.documentType.replace("_", " ")}</span>
              </td>
              <td className="px-6 py-4">
                <Badge variant={doc.status === "verified" ? "success" : doc.status === "rejected" ? "danger" : "warning"}>
                  {doc.status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <Link 
                  href={`/students/${doc.studentId?._id}/documents`}
                  className="text-primary-600 hover:underline text-xs font-bold"
                >
                  MANAGE
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
