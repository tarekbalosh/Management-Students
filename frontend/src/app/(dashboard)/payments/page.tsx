"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  Receipt, 
  Search, 
  Plus, 
  ExternalLink,
  Download,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Payment, FinancialSummary } from "@/types/payment";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const fetchPayments = async (params: any) => {
  const { data } = await api.get("/payments", { params });
  return data.data;
};

const fetchFinancialSummary = async () => {
  const { data } = await api.get("/payments/summary");
  return data.data;
};

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["payments", filters],
    queryFn: () => fetchPayments(filters)
  });

  const { data: summary } = useQuery<FinancialSummary>({
    queryKey: ["financial-summary"],
    queryFn: fetchFinancialSummary
  });

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Revenue & Invoicing" 
        subtitle="Manage student billing, track payments, and monitor financial health."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Revenue" 
          value={`$${summary?.overview.totalRevenue.toLocaleString() || "0"}`}
          icon={TrendingUp}
          color="text-emerald-600"
          bg="bg-emerald-50"
          trend="+12% from last month"
        />
        <KPICard 
          label="Pending Payments" 
          value={`$${summary?.overview.totalPending.toLocaleString() || "0"}`}
          icon={Clock}
          color="text-amber-600"
          bg="bg-amber-50"
          trend="Invoices pending"
        />
        <KPICard 
          label="Overdue" 
          value={`$${summary?.overview.totalOverdue.toLocaleString() || "0"}`}
          icon={AlertCircle}
          color="text-rose-600"
          bg="bg-rose-50"
          trend="Requires attention"
        />
        <KPICard 
          label="This Month" 
          value={`$${summary?.overview.thisMonth.toLocaleString() || "0"}`}
          icon={ArrowUpRight}
          color="text-primary-600"
          bg="bg-primary-50"
          trend="Real-time collection"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Growth</h3>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                 Monthly View
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary?.monthlyRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="revenue" fill="#0f172a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Payment Methods</h3>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary?.methodBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={10}
                    dataKey="amount"
                    nameKey="_id"
                  >
                    {(summary?.methodBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4">
              {summary?.methodBreakdown.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5] }} />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item._id.replace('_', ' ')}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-1 items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search invoice number or student..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 outline-none appearance-none cursor-pointer"
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Link 
            href="/payments/new"
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={18} />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Invoice Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Due Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <Clock className="animate-spin mx-auto text-primary-600 mb-4" size={32} />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Invoices...</p>
                </td>
              </tr>
            ) : paymentsData?.payments.map((invoice: Payment) => (
              <tr key={invoice._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{invoice.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(invoice.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-slate-700">{invoice.studentId?.firstName} {invoice.studentId?.lastName}</p>
                    <p className="text-xs text-slate-400 font-medium">{invoice.studentId?.email}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <p className="text-sm font-black text-slate-900">${invoice.totalAmount.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">Paid: ${invoice.paidAmount}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className={cn(
                    "text-xs font-bold",
                    new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? "text-rose-500" : "text-slate-500"
                  )}>
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/payments/${invoice._id}`}
                      className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col gap-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", bg, color)}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{trend}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    overdue: "bg-rose-50 text-rose-600 border-rose-100",
    sent: "bg-blue-50 text-blue-600 border-blue-100",
    draft: "bg-slate-50 text-slate-500 border-slate-100",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
      styles[status] || styles.draft
    )}>
      {status}
    </span>
  );
}
