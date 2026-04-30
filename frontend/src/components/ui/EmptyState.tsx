import React from 'react';
import { LucideIcon, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = SearchX, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100",
      className
    )}>
      <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <button 
          onClick={action.onClick}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
