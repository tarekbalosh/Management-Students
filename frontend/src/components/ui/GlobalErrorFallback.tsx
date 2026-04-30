"use client";

import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-[3rem] p-16 shadow-2xl border border-slate-100 text-center">
        <div className="h-24 w-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-lg shadow-rose-100">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Something went wrong</h1>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          An unexpected error occurred in the application. We've logged the details and are looking into it.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl mb-10 text-left overflow-auto max-h-40 border border-slate-100">
           <p className="text-xs font-mono text-rose-600 leading-tight whitespace-pre-wrap">
             {error.message}
           </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={resetErrorBoundary}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all"
          >
            <Home size={16} />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
