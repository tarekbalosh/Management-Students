import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { SearchX } from "lucide-react";

interface DataTableProps {
  columns: string[];
  isLoading?: boolean;
  isEmpty?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function DataTable({
  columns,
  isLoading,
  isEmpty,
  children,
  className,
}: DataTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-soft", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-8 py-5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-8 py-6">
                      <Skeleton className="h-6 w-full rounded-xl" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20">
                   <EmptyState 
                     title="No Records Found" 
                     description="We couldn't find any data matching your criteria."
                     icon={SearchX}
                   />
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
