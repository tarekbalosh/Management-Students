"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Save, 
  Eye, 
  User as UserIcon,
  Calendar,
  DollarSign,
  Tag
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function InvoiceForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(initialData?.studentId?._id || "");
  const [items, setItems] = useState<InvoiceItem[]>(initialData?.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  const [discount, setDiscount] = useState({ type: "fixed", value: 0 });
  const [tax, setTax] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState(false);

  const { data: students } = useQuery({
    queryKey: ["students-list"],
    queryFn: async () => {
      const { data } = await api.get("/students");
      return data.data.students;
    }
  });

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = discount.type === "percent" ? (subtotal * discount.value / 100) : discount.value;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * tax / 100);
  const totalAmount = taxableAmount + taxAmount;

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    setItems(newItems);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post("/payments", data);
      return response;
    },
    onSuccess: () => {
      router.push("/payments");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      studentId,
      items,
      subtotal,
      discount,
      tax,
      totalAmount,
      dueDate,
      notes,
      status: "sent"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {initialData ? "Edit Invoice" : "Create New Invoice"}
        </h2>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm"
          >
            <Eye size={18} />
            {preview ? "Edit Form" : "Preview Invoice"}
          </button>
          <button 
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Save size={18} />
            {createMutation.isPending ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items Table */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                <Calculator size={20} className="text-primary-600" />
                Line Items
              </h3>
              <button 
                type="button"
                onClick={addItem}
                className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary-100 transition-all"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="col-span-6 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Consultation Fee, Visa Fee, etc."
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 text-sm font-bold focus:border-primary-600 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qty</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary-600 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="number" 
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-10 pr-6 py-3 text-sm font-bold focus:border-primary-600 focus:bg-white outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-1 pb-1">
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all group shadow-sm"
                    >
                      <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Additional Notes</h3>
            <textarea 
              rows={4}
              placeholder="Terms and conditions, bank instructions, or personal note to the student..."
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm font-medium focus:border-primary-600 focus:bg-white outline-none transition-all resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Configuration Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <UserIcon size={12} />
                  Bill To Student
                </label>
                <select 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Student</option>
                  {students?.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <Calendar size={12} />
                  Due Date
                </label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-primary-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <Tag size={12} />
                    Tax (%)
                  </label>
                  <input 
                    type="number" 
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Discount
                  </label>
                  <input 
                    type="number" 
                    value={discount.value}
                    onChange={(e) => setDiscount(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-8 border-t border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-rose-400">
                <span>Discount</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                <span>Tax ({tax}%)</span>
                <span>+${taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-800">
                <span className="text-lg font-black uppercase tracking-widest text-primary-400">Grand Total</span>
                <span className="text-3xl font-black text-white">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
