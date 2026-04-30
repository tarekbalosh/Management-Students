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
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
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
