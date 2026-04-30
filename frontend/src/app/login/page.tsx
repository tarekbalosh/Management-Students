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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl mb-4">
            <LayoutDashboard className="text-primary-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-slate-500">Sign in to your Student Management System</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border bg-white p-8 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none focus:border-primary-500 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-primary-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm outline-none focus:border-primary-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 border border-rose-100 animate-in fade-in slide-in-from-top-1">
                <ShieldCheck size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full h-12 items-center justify-center rounded-xl bg-primary-600 font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            Protected by enterprise-grade security. 
            <br />
            Need help? Contact your administrator.
          </div>
        </div>
      </div>
    </div>
  );
}
