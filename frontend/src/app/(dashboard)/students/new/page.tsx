"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

// ── Validation Schema ──────────────────────────
const studentSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  nationality: z.string().min(2, "Required"),
  nationalId: z.string().optional(),
  
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }).optional(),

  educationLevel: z.string().optional(),
  previousUniversity: z.string().optional(),
  GPA: z.string().optional(),
  languageScore: z.object({
    testType: z.string().optional(),
    score: z.string().optional(),
  }).optional(),

  status: z.string(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const STEPS = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "contact", title: "Contact Details", icon: MapPin },
  { id: "academic", title: "Academic Background", icon: GraduationCap },
  { id: "review", title: "Review", icon: CheckCircle2 },
];

export default function NewStudentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: "lead",
      gender: "male",
    }
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields as any);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["firstName", "lastName", "email", "gender", "nationality"];
      case 1: return ["address.street", "address.city", "address.country"];
      default: return [];
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post("/students", data);
      router.push("/students");
    } catch (err) {
      console.error(err);
      alert("Error creating student profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <PageHeader 
        title="Add New Student" 
        subtitle="Create a comprehensive profile for a new admission candidate."
      />

      {/* Stepper Progress */}
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0" />
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i <= currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isActive ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-slate-200 text-slate-400"
              )}>
                <Icon size={20} />
              </div>
              <span className={cn("text-xs font-bold", isActive ? "text-primary-600" : "text-slate-400")}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border p-8 shadow-sm">
        {/* Step 1: Personal */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
              <div className="h-24 w-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-1 hover:bg-slate-50 cursor-pointer transition-colors">
                <Camera size={24} />
                <span className="text-[10px] font-bold">UPLOAD</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Profile Photo</h3>
                <p className="text-sm text-slate-500">JPG, PNG or WEBP. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">First Name *</label>
                <input {...register("firstName")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none transition-all" />
                {errors.firstName && <p className="text-xs text-rose-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Last Name *</label>
                <input {...register("lastName")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
                {errors.lastName && <p className="text-xs text-rose-500">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address *</label>
                <input {...register("email")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
                {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nationality *</label>
                <input {...register("nationality")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
                {errors.nationality && <p className="text-xs text-rose-500">{errors.nationality.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-bold text-slate-900 border-b pb-2">Address Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Street Address</label>
                <input {...register("address.street")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">City</label>
                  <input {...register("address.city")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Country</label>
                  <input {...register("address.country")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Academic (Simplified) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Education Level</label>
                <select {...register("educationLevel")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none">
                  <option value="high_school">High School</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Previous University</label>
                <input {...register("previousUniversity")} className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-primary-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center py-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">All set!</h3>
            <p className="text-slate-500">Please review the information before creating the profile.</p>
            <div className="text-left bg-slate-50 p-6 rounded-2xl space-y-2">
              <p><strong>Name:</strong> {getValues("firstName")} {getValues("lastName")}</p>
              <p><strong>Email:</strong> {getValues("email")}</p>
              <p><strong>Nationality:</strong> {getValues("nationality")}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 flex items-center justify-between border-t pt-8">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50",
              currentStep === 0 && "invisible"
            )}
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>

          {currentStep === STEPS.length - 1 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              <span>Create Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
            >
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
