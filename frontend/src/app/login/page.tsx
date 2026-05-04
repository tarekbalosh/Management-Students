"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { 
  Loader2, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.data.accessToken, data.data.user);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-50 rounded-full blur-[160px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[160px]" />
      </div>

      <div className="relative w-full max-w-[480px]">
        {/* Logo Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-white shadow-soft mb-4 border border-slate-50">
            <LayoutDashboard className="text-primary-600" size={40} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Welcome Back</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sign in to your Student Management System</p>
        </div>

        {/* Login Card */}
        <div className="rounded-[3rem] border border-slate-100 bg-white/80 p-12 shadow-soft backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="w-full h-14 rounded-2xl border-none bg-slate-50 pl-14 pr-6 text-sm font-medium outline-none ring-primary-500 transition-all focus:ring-2 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  autoCapitalize="none"
                  autoComplete="current-password"
                  className="w-full h-14 rounded-2xl border-none bg-slate-50 pl-14 pr-6 text-sm font-medium outline-none ring-primary-500 transition-all focus:ring-2 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-5 text-xs font-bold text-rose-600 border border-rose-100 animate-in fade-in slide-in-from-top-1">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-14 text-sm"
            >
              <div className="flex items-center gap-3">
                <span>Sign In</span>
                <ArrowRight className="transition-transform" size={20} />
              </div>
            </Button>
          </form>

          <div className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Protected by enterprise-grade security. 
            <br />
            Need help? Contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
}
