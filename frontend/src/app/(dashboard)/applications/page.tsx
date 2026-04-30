"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { 
  Plus, 
  LayoutGrid, 
  List as ListIcon, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Building,
  GraduationCap
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUSES = ['draft', 'submitted', 'under_review', 'conditional', 'accepted', 'rejected', 'withdrawn'];

const fetchApplications = async (params: any) => {
  const { data } = await api.get("/applications", { params });
  return data.data;
};

export default function ApplicationsPage() {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["applications", { search }],
    queryFn: () => fetchApplications({ search }),
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Applications" 
        subtitle="Track and manage student applications across all universities."
      >
        <div className="flex items-center rounded-lg border bg-white p-1 shadow-sm">
          <button 
            onClick={() => setView("table")}
            className={cn("p-1.5 rounded-md transition-all", view === "table" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
          >
            <ListIcon size={18} />
          </button>
          <button 
            onClick={() => setView("kanban")}
            className={cn("p-1.5 rounded-md transition-all", view === "kanban" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600")}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
        <Link 
          href="/applications/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
        >
          <Plus size={18} />
          <span>New Application</span>
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search student or university..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {view === "table" ? (
        <DataTable 
          columns={["Student", "University", "Program", "Intake", "Status", ""]}
          isLoading={isLoading}
          isEmpty={data?.applications?.length === 0}
        >
          {data?.applications?.map((app: any) => (
            <tr key={app._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <Link href={`/students/${app.studentId?._id}`} className="font-semibold text-slate-900 hover:text-primary-600">
                  {app.studentId?.firstName} {app.studentId?.lastName}
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building size={14} className="text-slate-400" />
                  {app.universityId?.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap size={14} className="text-slate-400" />
                  {app.programId} {/* In real app, we'd populate program name */}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  {app.intake.semester} {app.intake.year}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={getStatusVariant(app.status)}>
                  {app.status.replace("_", " ").toUpperCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/applications/${app._id}`} className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <KanbanBoard applications={data?.applications || []} isLoading={isLoading} />
      )}
    </div>
  );
}

function getStatusVariant(status: string): any {
  switch (status) {
    case 'accepted': return 'success';
    case 'rejected': return 'danger';
    case 'under_review':
    case 'conditional': return 'warning';
    case 'submitted': return 'default';
    default: return 'outline';
  }
}

// ── Kanban Board Component ──────────────────────
function KanbanBoard({ applications, isLoading }: { applications: any[], isLoading: boolean }) {
  if (isLoading) return <div>Loading board...</div>;

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px]">
      {STATUSES.map(status => {
        const columnApps = applications.filter(app => app.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                {status.replace("_", " ")}
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                  {columnApps.length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 rounded-xl bg-slate-100/50 p-3 space-y-3 border-2 border-dashed border-transparent hover:border-slate-200 transition-colors">
              {columnApps.map(app => (
                <div key={app._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                  <p className="font-bold text-slate-900 text-sm">
                    {app.studentId?.firstName} {app.studentId?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{app.universityId?.name}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {app.intake.semester} {app.intake.year}
                    </span>
                    <Link href={`/applications/${app._id}`} className="text-[10px] font-bold text-primary-600 hover:underline">
                      DETAILS
                    </Link>
                  </div>
                </div>
              ))}
              {columnApps.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-400">Empty</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
