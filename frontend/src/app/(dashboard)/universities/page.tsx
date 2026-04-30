"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { 
  Building, 
  MapPin, 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  School,
  GraduationCap,
  Trophy,
  Loader2
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetchUniversities = async (params: any) => {
  const { data } = await api.get("/universities", { params });
  return data.data;
};

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["universities", { search, country }],
    queryFn: () => fetchUniversities({ search, country }),
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="University Catalog" 
        subtitle="Explore partner universities and their academic programs."
      >
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95">
          <Plus size={18} />
          <span>Add University</span>
        </button>
      </PageHeader>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, country, or field..."
            className="w-full h-12 rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-primary-500 min-w-[160px]"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
          <button className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Grid of Universities */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.universities?.map((uni: any) => (
            <div key={uni._id} className="group flex flex-col bg-white rounded-2xl border shadow-sm transition-all hover:shadow-xl hover:border-primary-100 overflow-hidden">
              {/* Header Image Placeholder */}
              <div className="h-32 bg-slate-100 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <div className="h-12 w-12 rounded-xl bg-white border p-2 shadow-sm flex items-center justify-center">
                    <Building className="text-primary-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-8 space-y-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {uni.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                    <MapPin size={14} />
                    {uni.city}, {uni.country}
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programs</span>
                    <span className="text-sm font-bold text-slate-700">{uni.programs?.length || 0}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ranking</span>
                    <span className="text-sm font-bold text-slate-700">#{uni.ranking?.world || "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {uni.programs?.slice(0, 2).map((p: any, i: number) => (
                    <Badge key={i} variant="outline" className="text-[10px] uppercase">
                      {p.degree}
                    </Badge>
                  ))}
                  {(uni.programs?.length || 0) > 2 && (
                    <span className="text-[10px] font-bold text-slate-400">+{uni.programs.length - 2} more</span>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t flex items-center justify-between">
                <a 
                  href={uni.website} 
                  target="_blank" 
                  className="text-slate-400 hover:text-primary-600 transition-colors"
                >
                  <Globe size={18} />
                </a>
                <Link 
                  href={`/universities/${uni._id}`}
                  className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:underline"
                >
                  View Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data?.universities?.length === 0 && (
        <div className="bg-white rounded-2xl border p-20 text-center space-y-4">
          <School size={64} className="mx-auto text-slate-200" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">No Universities Found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
          <button 
            onClick={() => { setSearch(""); setCountry(""); }}
            className="text-primary-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
