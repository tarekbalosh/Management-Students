"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  User as UserIcon,
  Download,
  Mail,
  Phone
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const fetchStudents = async ({ page, limit, search, status }: any) => {
  const { data } = await api.get("/students", {
    params: { page, limit, search, status }
  });
  return data;
};

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["students", { page, search, status }],
    queryFn: () => fetchStudents({ page, limit: 10, search, status }),
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Students" 
        subtitle="Manage and track all student profiles and their progress."
      >
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
          <Download size={18} />
          <span>Export</span>
        </button>
        <Link 
          href="/students/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
        >
          <Plus size={18} />
          <span>Add Student</span>
        </Link>
      </PageHeader>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="applied">Applied</option>
            <option value="enrolled">Enrolled</option>
          </select>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <DataTable 
        columns={["Student", "Contact", "Status", "Applications", "Registered", ""]}
        isLoading={isLoading}
        isEmpty={data?.data?.students?.length === 0}
      >
        {data?.data?.students?.map((student: any) => (
          <tr key={student._id} className="group hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold border border-primary-100">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <Link href={`/students/${student._id}`} className="font-semibold text-slate-900 hover:text-primary-600">
                    {student.firstName} {student.lastName}
                  </Link>
                  <p className="text-xs text-slate-500">{student.nationality}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Mail size={12} className="text-slate-400" />
                  {student.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Phone size={12} className="text-slate-400" />
                  {student.phone || "N/A"}
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <Badge variant={
                student.status === "enrolled" ? "success" : 
                student.status === "lead" ? "default" : "warning"
              }>
                {student.status.toUpperCase()}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-primary-500" 
                    style={{ width: `${Math.min(student.applicationsCount * 25, 100)}%` }} 
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">{student.applicationsCount || 0}</span>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
              {new Date(student.registrationDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right">
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">10</span> of <span className="font-medium text-slate-900">{data?.pagination?.total || 0}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            disabled={page >= (data?.pagination?.totalPages || 1)}
            onClick={() => setPage(p => p + 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
