"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  Building, 
  GraduationCap, 
  User, 
  Calendar,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ── Validation Schema ──────────────────────────
const schema = z.object({
  studentId: z.string().min(1, "Select a student"),
  universityId: z.string().min(1, "Select a university"),
  programId: z.string().min(1, "Select a program"),
  intake: z.object({
    semester: z.string(),
    year: z.number().min(2024),
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewApplicationPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      intake: { semester: 'Fall', year: 2024 }
    }
  });

  // Queries for selectors
  const { data: students } = useQuery({ queryKey: ["students-list"], queryFn: () => api.get("/students").then(res => res.data.data.students) });
  const { data: universities } = useQuery({ queryKey: ["unis-list"], queryFn: () => api.get("/universities").then(res => res.data.data.universities) });

  const selectedUniId = watch("universityId");
  const selectedUni = universities?.find((u: any) => u._id === selectedUniId);

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/applications", data);
      router.push("/applications");
    } catch (err) {
      alert("Error creating application.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <PageHeader 
        title="New Application" 
        subtitle="Initiate a university application for a student."
      />

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Step Indicators */}
        <div className="flex border-b">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={cn(
              "flex-1 text-center py-4 text-xs font-bold transition-all",
              step === i ? "bg-primary-50 text-primary-600 border-b-2 border-primary-600" : "text-slate-400"
            )}>
              STEP 0{i}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* Step 1: Student Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User size={20} className="text-primary-600" />
                Select Student
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search by name or email..." className="w-full h-12 rounded-xl border pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {students?.map((s: any) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => { setValue("studentId", s._id); setStep(2); }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                        watch("studentId") === s._id ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "hover:bg-slate-50"
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: University & Program */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building size={20} className="text-primary-600" />
                Choose Destination
              </h3>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">University</label>
                <select 
                  {...register("universityId")} 
                  className="w-full h-12 rounded-xl border px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">Select a university...</option>
                  {universities?.map((u: any) => <option key={u._id} value={u._id}>{u.name} ({u.country})</option>)}
                </select>

                {selectedUniId && (
                  <div className="space-y-4 mt-8">
                    <label className="text-sm font-bold text-slate-700">Available Programs</label>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedUni?.programs?.map((p: any) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => { setValue("programId", p._id); }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                            watch("programId") === p._id ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "hover:bg-slate-50"
                          )}
                        >
                          <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center text-primary-600">
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.degree} • {p.durationMonths} Months</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Intake & Notes */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-primary-600" />
                Intake Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Semester</label>
                  <select {...register("intake.semester")} className="w-full h-12 rounded-xl border px-4">
                    {['Spring', 'Summer', 'Fall', 'Winter'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Year</label>
                  <input type="number" {...register("intake.year", { valueAsNumber: true })} className="w-full h-12 rounded-xl border px-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Application Notes</label>
                <textarea {...register("notes")} rows={4} className="w-full rounded-xl border p-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="Any special instructions or student preferences..." />
              </div>
            </div>
          )}

          {/* Step 4: Final Review */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-in zoom-in-95">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-2">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Ready to Launch!</h3>
              <p className="text-slate-500">Please confirm the application details before submitting.</p>
              
              <div className="text-left bg-slate-50 p-6 rounded-2xl space-y-3 border">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Student</span>
                  <span className="text-sm font-bold text-slate-900">{students?.find((s: any) => s._id === watch("studentId"))?.firstName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">University</span>
                  <span className="text-sm font-bold text-slate-900">{selectedUni?.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Intake</span>
                  <span className="text-sm font-bold text-slate-900">{watch("intake.semester")} {watch("intake.year")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t pt-8">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(s - 1, 1))}
              className={cn("flex items-center gap-2 font-bold text-slate-400 hover:text-slate-600", step === 1 && "invisible")}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-800"
              >
                Continue
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-10 py-3 text-sm font-bold text-white shadow-lg shadow-primary-100 transition-all hover:bg-primary-700"
              >
                Create Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
