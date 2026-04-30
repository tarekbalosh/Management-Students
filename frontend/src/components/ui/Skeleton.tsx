import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-slate-100", className)} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 space-y-6">
       <Skeleton className="h-8 w-1/3" />
       <Skeleton className="h-24 w-full" />
       <div className="flex gap-4">
         <Skeleton className="h-10 w-24 rounded-xl" />
         <Skeleton className="h-10 w-24 rounded-xl" />
       </div>
    </div>
  );
}
