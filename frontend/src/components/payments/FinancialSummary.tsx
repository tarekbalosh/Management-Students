"use client";

import { FinancialSummary as FinancialSummaryType } from "@/types/payment";
import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  DollarSign,
  ArrowUpRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { cn } from "@/lib/utils";

interface FinancialSummaryProps {
  summary: FinancialSummaryType;
}

export function FinancialSummary({ summary }: FinancialSummaryProps) {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Revenue Trends</h3>
                 <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Monthly collection performance</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} />
                +24% YoY
              </div>
           </div>

           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={summary.monthlyRevenue}>
                    <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="_id" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', padding: '20px' }}
                      itemStyle={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6366f1" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Method Breakdown */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
           <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Methods</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Distribution by source</p>
           </div>

           <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={summary.methodBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="amount"
                    >
                      {summary.methodBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                 <PieChartIcon size={32} className="text-slate-200" />
              </div>
           </div>

           <div className="space-y-4">
              {summary.methodBreakdown.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{method._id}</span>
                   </div>
                   <span className="text-sm font-black text-slate-900">${method.amount.toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Top Paying Students */}
         <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
               <Users size={28} className="text-primary-600" />
               Premium Accounts
            </h3>
            <div className="space-y-4">
               {summary.topStudents.map((item, index) => (
                 <div key={index} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                          <span className="text-sm font-black">{index + 1}</span>
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">{item.student.firstName} {item.student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.student.nationality}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-slate-900">${item.totalPaid.toLocaleString()}</p>
                       <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                          <ArrowUpRight size={12} />
                          Lifetime
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Financial Health / Summary Box */}
         <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-primary-600/10 blur-[120px] rounded-full translate-x-1/2" />
            
            <div className="relative z-10 space-y-12">
               <div className="h-16 w-16 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/50">
                  <DollarSign size={32} />
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Fiscal Year<br /><span className="text-primary-400">Projection</span></h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    Based on current application volume and payment collection cycles, you are trending 15% ahead of your quarterly targets.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Collection Efficiency</p>
                     <p className="text-3xl font-black">94.2%</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg. Ticket Size</p>
                     <p className="text-3xl font-black">$3,420</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
