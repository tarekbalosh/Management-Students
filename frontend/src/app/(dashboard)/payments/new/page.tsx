"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calculator, 
  Calendar as CalendarIcon,
  User,
  Info,
  DollarSign,
  Percent
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState({ type: "percent", value: 0 });
  const [tax, setTax] = useState(0);
  const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 86400000 * 30), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");

  // Fetch students for selection
  const { data: students } = useQuery({
    queryKey: ["students-search", studentSearch],
    queryFn: async () => {
      if (!studentSearch) return [];
      const { data } = await api.get(`/students?search=${studentSearch}`);
      return data.data.students;
    },
    enabled: studentSearch.length > 2
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post("/payments", data);
      return response;
    },
    onSuccess: (data) => {
      router.push(`/payments/${data.data.payment._id}`);
    },
    onError: (error: any) => {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Failed to create invoice. Please check all fields.");
    }
  });

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = discount.type === 'percent' ? (subtotal * discount.value / 100) : discount.value;
  const taxAmount = ((subtotal - discountAmount) * tax / 100);
  const totalAmount = subtotal - discountAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Please select a student");

    // Filter out empty items
    const validItems = items.filter(item => item.description.trim() && item.quantity > 0 && item.unitPrice > 0);
    if (validItems.length === 0) {
      return alert("Please add at least one valid item with a description and price.");
    }
    
    createInvoiceMutation.mutate({
      studentId: selectedStudent._id,
      items: validItems,
      subtotal,
      discount,
      tax,
      totalAmount,
      dueDate,
      notes,
      status: 'sent'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link href="/payments" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Payments
        </Link>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Create New Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Selection</label>
                <div className="relative">
                  <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search student name..." 
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-8 py-4 text-sm font-bold text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
                    value={studentSearch}
                    onChange={(e) => {
                        setStudentSearch(e.target.value);
                        if (selectedStudent) setSelectedStudent(null);
                    }}
                  />
                  {students && students.length > 0 && !selectedStudent && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {students.map((s: any) => (
                        <button 
                          key={s._id}
                          type="button"
                          className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setSelectedStudent(s);
                            setStudentSearch(`${s.firstName} ${s.lastName}`);
                          }}
                        >
                          <p className="text-sm font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                <div className="relative">
                  <CalendarIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-8 py-4 text-sm font-bold text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Invoice Items</h3>
              <button 
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4">
                <div className="col-span-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</div>
                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</div>
                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</div>
                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center group">
                  <div className="col-span-6 relative">
                    <input 
                      type="text" 
                      placeholder="Item description..."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-6 py-3 text-sm font-bold text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 text-center focus:border-primary-600 focus:bg-white outline-none transition-all"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 text-right focus:border-primary-600 focus:bg-white outline-none transition-all"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex-1 text-sm font-black text-slate-900 text-right">
                      ${item.total.toLocaleString()}
                    </div>
                    {items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-rose-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
             <textarea 
               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all min-h-[100px]"
               placeholder="Payment terms, bank details, or student notes..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
             />
          </div>
        </div>

        {/* Totals Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8 sticky top-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <Calculator size={20} className="text-primary-600" />
              Summary
            </h3>

            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                <span className="uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-900">${subtotal.toLocaleString()}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount</span>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setDiscount({ ...discount, type: 'percent' })}
                      className={cn("p-1.5 rounded-md transition-all", discount.type === 'percent' ? "bg-white text-primary-600 shadow-sm" : "text-slate-400")}
                    >
                      <Percent size={12} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDiscount({ ...discount, type: 'fixed' })}
                      className={cn("p-1.5 rounded-md transition-all", discount.type === 'fixed' ? "bg-white text-primary-600 shadow-sm" : "text-slate-400")}
                    >
                      <DollarSign size={12} />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-6 py-3 text-sm font-black text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
                    value={discount.value}
                    onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500 font-black text-xs">
                    -${discountAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tax (%)</span>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-6 py-3 text-sm font-black text-slate-900 focus:border-primary-600 focus:bg-white outline-none transition-all"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">
                    +${taxAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-50">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">${totalAmount.toLocaleString()}</span>
                </div>

                <button 
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {createInvoiceMutation.isPending ? "Generating Invoice..." : "Finalize & Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
