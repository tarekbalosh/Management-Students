"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  CreditCard, 
  Download, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortalPaymentsPage() {
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["portal-payments"],
    queryFn: async () => {
      const { data } = await api.get("/portal/payments");
      return data.data.payments;
    }
  });

  if (isLoading) return <div className="p-20 text-center animate-pulse">Loading Invoices...</div>;

  const totalPaid = paymentsData?.reduce((acc: number, p: any) => acc + (p.paidAmount || 0), 0) || 0;
  const totalPending = paymentsData?.reduce((acc: number, p: any) => acc + (p.totalAmount - (p.paidAmount || 0)), 0) || 0;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Payments</h1>
           <p className="text-slate-500 font-bold text-sm mt-2">Track your tuition fees and service charges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-100 flex items-center justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={120} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Total Paid</p>
              <h3 className="text-4xl font-black tracking-tighter">${totalPaid.toLocaleString()}</h3>
           </div>
           <div className="h-16 w-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
              <CheckCircle size={32} />
           </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-200 flex items-center justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clock size={120} />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Balance Due</p>
              <h3 className="text-4xl font-black tracking-tighter">${totalPending.toLocaleString()}</h3>
           </div>
           <div className="h-16 w-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
              <CreditCard size={32} />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm overflow-hidden">
        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Billing History</h4>
        <div className="divide-y divide-slate-50">
           {paymentsData?.map((payment: any) => (
             <div key={payment._id} className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex items-center gap-6">
                   <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                      <Receipt size={24} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{payment.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(payment.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <p className="text-sm font-black text-slate-900">${payment.totalAmount.toLocaleString()}</p>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                        payment.status === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {payment.status}
                      </span>
                   </div>
                   
                   <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                      <Download size={20} />
                   </button>
                </div>
             </div>
           ))}

           {paymentsData?.length === 0 && (
             <div className="py-20 text-center">
                <Receipt size={48} className="mx-auto text-slate-100 mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No billing records found</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
