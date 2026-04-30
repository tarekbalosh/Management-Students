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

// ── Data Fetching ──────────────────────────────
const fetchStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
};

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        <p className="text-slate-500 animate-pulse">Gathering intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-100 bg-rose-50 p-8 text-center text-rose-900">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
        <h2 className="text-xl font-bold">Failed to load statistics</h2>
        <p className="mt-2 text-rose-700">Please check your connection and try again.</p>
      </div>
    );
  }

  const pieData = [
    { name: "Pending", value: data.pendingApplications },
    { name: "Accepted", value: data.acceptedApplications },
    { name: "Rejected", value: data.rejectedApplications },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <PageHeader 
        title="Dashboard" 
        subtitle="Manage your admission pipeline and student records."
      />

      {/* ── KPI Section ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          trend={{ value: data.pendingApplications, isUp: true }} // Just using value for show
        />
        <StatCard 
          title="Visa Approved" 
          value={data.visaApproved} 
          icon={Plane} 
        />
        <StatCard 
          title="Revenue (Paid)" 
          value={`$${data.totalPaymentsAmount.toLocaleString()}`} 
          icon={DollarSign} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Main Charts ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-bold text-slate-900">Application Trends (Last 12 Months)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.applicationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <DataTable 
              columns={["Student", "University", "Status", "Date"]}
              isEmpty={data.recentApplications.length === 0}
            >
              {data.recentApplications.map((app: any) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {app.studentId?.firstName} {app.studentId?.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{app.universityId?.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant={app.status === "accepted" ? "success" : app.status === "rejected" ? "danger" : "warning"}>
                      {app.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>

        {/* ── Sidebar Stats ── */}
        <div className="space-y-8">
          {/* Pie Chart */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 font-bold text-slate-900">Status Distribution</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New Student", icon: Plus, color: "bg-indigo-50 text-indigo-600" },
                { label: "Application", icon: FileCheck, color: "bg-emerald-50 text-emerald-600" },
                { label: "Document", icon: Upload, color: "bg-amber-50 text-amber-600" },
                { label: "Payment", icon: CreditCard, color: "bg-rose-50 text-rose-600" },
              ].map((action, i) => (
                <button 
                  key={i}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-md active:scale-95"
                >
                  <div className={cn("rounded-lg p-2", action.color)}>
                    <action.icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Recent Alerts</h3>
            <div className="space-y-4">
              {data.recentNotifications.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No new notifications.</p>
              ) : (
                data.recentNotifications.map((n: any) => (
                  <div key={n._id} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">{n.message}</p>
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
