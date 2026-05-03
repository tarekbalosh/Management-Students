"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
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
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Student Directory" 
        subtitle="Manage and track all student profiles and their admission progress."
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download size={16} />
            <span>Export</span>
          </Button>
          <Link href="/students/new">
            <Button size="sm">
              <Plus size={16} />
              <span>Add Student</span>
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Filters Bar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students by name, email or ID..."
            className="h-12 w-full rounded-2xl border-none bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none ring-primary-500 transition-all focus:ring-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select 
            className="h-12 rounded-2xl border-none bg-slate-50 px-6 text-xs font-black uppercase tracking-widest text-slate-500 outline-none ring-primary-500 focus:ring-2 cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="applied">Applied</option>
            <option value="enrolled">Enrolled</option>
          </select>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border-2 border-slate-50">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <DataTable 
        columns={["Student Details", "Contact Info", "Current Status", "Progress", "Joined", ""]}
        isLoading={isLoading}
        isEmpty={data?.data?.students?.length === 0}
        className="rounded-[2.5rem] border-none shadow-soft"
      >
        {data?.data?.students?.map((student: any) => (
          <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-black border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <Link href={`/students/${student._id}`} className="block font-black text-slate-900 hover:text-primary-600 tracking-tight transition-colors">
                    {student.firstName} {student.lastName}
                  </Link>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.nationality}</p>
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Mail size={14} className="text-slate-300" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <Phone size={14} className="text-slate-300" />
                  {student.phone || "No contact"}
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
              <Badge variant={
                student.status === "enrolled" ? "success" : 
                student.status === "lead" ? "default" : "warning"
              }>
                {student.status}
              </Badge>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-500" 
                    style={{ width: `${Math.min((student.applicationsCount || 0) * 25, 100)}%` }} 
                  />
                </div>
                <span className="text-xs font-black text-slate-900">{student.applicationsCount || 0}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {new Date(student.registrationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </td>
            <td className="px-8 py-6 text-right">
              <button className="rounded-xl p-2 text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Displaying <span className="text-slate-900">{((page - 1) * 10) + 1}</span> - <span className="text-slate-900">{Math.min(page * 10, data?.pagination?.total || 0)}</span> of <span className="text-slate-900">{data?.pagination?.total || 0}</span> Students
        </p>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="h-10 px-5"
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            size="sm"
            disabled={page >= (data?.pagination?.totalPages || 1)}
            onClick={() => setPage(p => p + 1)}
            className="h-10 px-5"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
