"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { 
  Users, 
  FileCheck,
  Plane, 
  CreditCard,
  Plus, 
  Upload, 
  DollarSign,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ── Data Fetching ──────────────────────────────
const fetchStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
};

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-10 pb-20">
      {/* ── Header ── */}
      <PageHeader 
        title="Intelligence Dashboard" 
        subtitle="Operational overview and performance metrics for the admission cycle."
      />

      {/* ── KPI Section ── */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={data.totalStudents} 
          icon={Users} 
          trend={{ value: 12, isUp: true }} 
        />
        <StatCard 
          title="Active Applications" 
          value={data.totalApplications} 
          icon={FileCheck} 
          trend={{ value: 8, isUp: true }} 
        />
        <StatCard 
          title="Visa Approved" 
          value={data.visaApproved} 
          icon={Plane} 
          trend={{ value: 5, isUp: true }}
        />
        <StatCard 
          title="Revenue (Paid)" 
          value={`$${data.totalPaymentsAmount.toLocaleString()}`} 
          icon={DollarSign} 
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ── Main Charts ── */}
        <div className="lg:col-span-2 space-y-10">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-soft">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Application Trends</h3>
              <select className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500 px-4 py-2 outline-none">
                <option>Last 12 Months</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.applicationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)", padding: "12px 20px" }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Applications</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <DataTable 
              columns={["Student", "University", "Status", "Date"]}
              isEmpty={data.recentApplications.length === 0}
            >
              {data.recentApplications.map((app: any) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {app.studentId?.firstName} {app.studentId?.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">{app.universityId?.name}</td>
                  <td className="px-6 py-5">
                    <Badge variant={app.status === "accepted" ? "success" : app.status === "rejected" ? "danger" : "warning"}>
                      {app.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-slate-400 text-[10px] font-bold uppercase">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>

        {/* ── Sidebar Stats ── */}
        <div className="space-y-10">
          {/* Pie Chart */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-soft">
            <h3 className="mb-8 text-xl font-black text-slate-900 uppercase tracking-tight text-center">Pipeline Mix</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-soft">
            <h3 className="mb-6 text-xl font-black text-slate-900 uppercase tracking-tight">Launchpad</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add Student", icon: Plus, color: "text-indigo-600 bg-indigo-50" },
                { label: "New App", icon: FileCheck, color: "text-emerald-600 bg-emerald-50" },
                { label: "Upload Doc", icon: Upload, color: "text-amber-600 bg-amber-50" },
                { label: "Payment", icon: CreditCard, color: "text-rose-600 bg-rose-50" },
              ].map((action, i) => (
                <button 
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-transparent bg-slate-50 p-6 transition-all hover:border-primary-100 hover:bg-white hover:shadow-soft active:scale-95 group"
                >
                  <div className={cn("rounded-2xl p-3 transition-transform group-hover:scale-110", action.color)}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-soft">
            <h3 className="mb-6 text-xl font-black text-slate-900 uppercase tracking-tight">Intelligence</h3>
            <div className="space-y-6">
              {data.recentNotifications.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Systems normal. No alerts.</p>
              ) : (
                data.recentNotifications.map((n: any) => (
                  <div key={n._id} className="flex gap-4 border-b border-slate-50 pb-6 last:border-0 last:pb-0 group">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600 animate-pulse" />
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">{n.title}</p>
                      <p className="mt-1 text-[11px] text-slate-400 font-medium line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
