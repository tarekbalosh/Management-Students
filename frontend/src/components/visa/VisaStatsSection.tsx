"use client";

import { VisaStats } from "@/types/visa";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Globe,
  Building2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";

interface VisaStatsSectionProps {
  stats: VisaStats;
}

export function VisaStatsSection({ stats }: VisaStatsSectionProps) {
  const pieData = [
    { name: "Approved", value: stats?.approvalRate || 0, color: "#10b981" },
    { name: "Rejected", value: stats?.rejectionRate || 0, color: "#ef4444" },
    { name: "Pending/Other", value: 100 - ((stats?.approvalRate || 0) + (stats?.rejectionRate || 0)), color: "#94a3b8" },
  ];

  const universityData = (stats?.statsByUniversity || []).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Approval Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{(stats.approvalRate || 0).toFixed(1)}%</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">+2.4%</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Avg. Processing</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{(stats.avgProcessingTimeDays || 0).toFixed(1)} Days</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="h-10 w-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Cases</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{stats.total || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <XCircle size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500">Rejection Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-900">{(stats.rejectionRate || 0).toFixed(1)}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Rate Gauge/Pie */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Globe size={18} />
            </div>
            <h4 className="font-bold text-slate-900">Visa Decision Breakdown</h4>
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900">{(stats.approvalRate || 0).toFixed(0)}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Success</span>
            </div>
          </div>
        </div>

        {/* University Breakdown */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h4 className="font-bold text-slate-900">Performance by University</h4>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universityData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="university" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="rate" 
                  name="Success Rate %" 
                  fill="#6366f1" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
