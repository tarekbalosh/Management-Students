"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Building2,
  Mail,
  Phone,
  Receipt,
  CreditCard,
  Banknote,
  MoreVertical,
  History,
  FileText,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Payment, PaymentMethod, PaymentStatus } from "@/types/payment";
import { format } from "date-fns";

export default function InvoiceDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const id = params.id;
  const queryClient = useQueryClient();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: invoice, isLoading } = useQuery<Payment>({
    queryKey: ["invoice", id],
    queryFn: async () => {
      const { data } = await api.get(`/payments/${id}`);
      return data.data.payment;
    }
  });

  const recordPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post(`/payments/${id}/transaction`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      setShowPaymentModal(false);
    }
  });

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/payments/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice?.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download PDF");
    }
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center animate-pulse flex-col gap-4">
    <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-primary-600 animate-spin" />
    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Retrieving Invoice...</p>
  </div>;

  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link href="/payments" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} />
          All Invoices
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm">
            <Send size={18} />
            Send to Student
          </button>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={18} />
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Invoice View */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-16 border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden">
             {/* Invoice Watermark/Background decoration */}
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Receipt size={300} />
             </div>

             <div className="relative z-10">
                <div className="flex justify-between items-start border-b-2 border-slate-50 pb-12 mb-12">
                   <div>
                      <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6">
                        <Building2 size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">STUDY ABROAD CRM</h3>
                      <p className="text-sm text-slate-400 font-medium">123 Education Blvd, Suite 100<br />New York, NY 10001</p>
                   </div>
                   <div className="text-right">
                      <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Invoice</h1>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Number: <span className="text-slate-900">{invoice.invoiceNumber}</span></p>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Date: <span className="text-slate-900">{format(new Date(invoice.createdAt), 'MMM dd, yyyy')}</span></p>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Due Date: <span className="text-rose-500">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span></p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-20 mb-16">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bill To</p>
                      <h4 className="text-xl font-black text-slate-900 mb-2">{invoice.studentId?.firstName} {invoice.studentId?.lastName}</h4>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Mail size={14} /> {invoice.studentId?.email}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                          <Phone size={14} /> {invoice.studentId?.phone || "+1 234 567 890"}
                        </p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Status</p>
                      <div className="flex flex-col items-center gap-2">
                        <StatusBadge status={invoice.status} />
                        {invoice.status === 'paid' && (
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2">Paid on {format(new Date(invoice.paidAt!), 'MMM dd, yyyy')}</p>
                        )}
                      </div>
                   </div>
                </div>

                <table className="w-full text-left mb-16">
                   <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                        <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {invoice.items.map((item, i) => (
                        <tr key={i}>
                           <td className="py-6 text-sm font-bold text-slate-700">{item.description}</td>
                           <td className="py-6 text-sm font-bold text-slate-500 text-center">{item.quantity}</td>
                           <td className="py-6 text-sm font-bold text-slate-500 text-right">${(item.unitPrice || 0).toLocaleString()}</td>
                           <td className="py-6 text-sm font-black text-slate-900 text-right">${(item.total || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>

                <div className="flex justify-end border-t-2 border-slate-50 pt-12">
                   <div className="w-80 space-y-4">
                      <div className="flex justify-between text-sm font-bold text-slate-400">
                        <span>Subtotal</span>
                        <span className="text-slate-900">${(invoice.subtotal || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-400">
                        <span>Discount ({invoice.discount?.value || 0}{invoice.discount?.type === 'percent' ? '%' : ''})</span>
                        <span className="text-rose-500">-${((invoice.subtotal || 0) * (invoice.discount?.type === 'percent' ? (invoice.discount.value || 0) / 100 : 1) * (invoice.discount?.type === 'fixed' ? 1 : 1)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-400">
                        <span>Tax ({invoice.tax || 0}%)</span>
                        <span className="text-slate-900">${((invoice.subtotal || 0) * ((invoice.tax || 0) / 100)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-6 mt-6 border-t-2 border-slate-900 items-center">
                        <span className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">Total</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">${(invoice.totalAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl mt-4">
                        <span>Amount Paid</span>
                        <span>${(invoice.paidAmount || 0).toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {invoice.notes && (
                  <div className="mt-20 pt-12 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Internal Notes</p>
                    <p className="text-sm text-slate-500 leading-relaxed italic">{invoice.notes}</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
           {/* Payment History */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <History size={20} className="text-primary-600" />
                    History
                 </h4>
                 <StatusBadge status={invoice.status} />
              </div>

              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                 {invoice.transactions.length > 0 ? invoice.transactions.map((t, i) => (
                   <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 h-10 w-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-emerald-600 z-10 shadow-sm">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Payment Received</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(t.paidAt), 'MMM dd, yyyy')}</p>
                        <div className="mt-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                              <span className="text-sm font-black text-slate-900">${(t.amount || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{t.method}</span>
                           </div>
                        </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-10 text-center">
                      <Clock size={32} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No payments yet</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Attachments */}
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <FileText size={20} className="text-primary-600" />
                Attachments
              </h4>
              <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center hover:border-primary-200 hover:bg-primary-50/20 transition-all cursor-pointer group">
                 <Plus size={32} className="mx-auto text-slate-200 group-hover:text-primary-600 mb-4" />
                 <p className="text-sm font-bold text-slate-400 group-hover:text-primary-600">Upload Receipt</p>
              </div>
           </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onSubmit={(data) => recordPaymentMutation.mutate(data)}
          balance={(invoice.totalAmount || 0) - (invoice.paidAmount || 0)}
        />
      )}
    </div>
  );
}

function PaymentModal({ onClose, onSubmit, balance }: any) {
  const [amount, setAmount] = useState(balance);
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Record Payment</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount to Record</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-8 py-5 text-xl font-black text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest mt-2">Remaining Balance: ${(balance || 0).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <PaymentMethodOption 
               active={method === 'bank_transfer'} 
               icon={Building2} 
               label="Bank" 
               onClick={() => setMethod('bank_transfer')} 
             />
             <PaymentMethodOption 
               active={method === 'credit_card'} 
               icon={CreditCard} 
               label="Card" 
               onClick={() => setMethod('credit_card')} 
             />
             <PaymentMethodOption 
               active={method === 'cash'} 
               icon={Banknote} 
               label="Cash" 
               onClick={() => setMethod('cash')} 
             />
             <PaymentMethodOption 
               active={method === 'online'} 
               icon={Send} 
               label="Online" 
               onClick={() => setMethod('online')} 
             />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Reference</label>
            <input 
              type="text" 
              placeholder="Check#, SWIFT, or Auth Code"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
             <button 
               onClick={onClose}
               className="flex-1 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all"
             >
               Cancel
             </button>
             <button 
               onClick={() => onSubmit({ amount, method, reference })}
               className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
             >
               Save Payment
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodOption({ active, icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group",
        active ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100" : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
      )}
    >
      <Icon size={24} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400")} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
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
      "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
      styles[status] || styles.draft
    )}>
      {status}
    </span>
  );
}
