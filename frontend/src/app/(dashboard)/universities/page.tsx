"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  Building, 
  MapPin, 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  ArrowRight,
  School,
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
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="University Catalog" 
        subtitle="Discover world-class academic institutions and partner programs."
      >
        <Button size="sm">
          <Plus size={16} />
          <span>Add University</span>
        </Button>
      </PageHeader>

      {/* Search & Filters */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-soft">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by institution name, city or academic field..."
            className="w-full h-12 rounded-2xl border-none bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none ring-primary-500 transition-all focus:ring-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select 
            className="h-12 rounded-2xl border-none bg-slate-50 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none ring-primary-500 focus:ring-2 cursor-pointer"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All Regions</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border-2 border-slate-50">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Grid of Universities */}
      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {data?.universities?.map((uni: any) => (
            <div key={uni._id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-soft transition-all hover:shadow-indigo hover:border-primary-100 overflow-hidden">
              {/* Header Image Placeholder */}
              <div className="h-40 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <div className="absolute top-0 right-0 p-4 z-20">
                  <Badge variant="success" className="bg-white/90 backdrop-blur-md border-none text-emerald-600">
                    Partner
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-8 flex items-center gap-4 z-20">
                  <div className="h-16 w-16 rounded-2xl bg-white p-3 shadow-xl flex items-center justify-center border border-white/20">
                    <Building className="text-primary-600" size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                      <MapPin size={12} />
                      {uni.city}, {uni.country}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 pt-6 space-y-6 flex-1">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight leading-tight">
                  {uni.name}
                </h3>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Active Programs</span>
                    <span className="text-sm font-black text-slate-700">{uni.programs?.length || 0} Majors</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Global Ranking</span>
                    <span className="text-sm font-black text-slate-700">#{uni.ranking?.world || "N/A"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {uni.programs?.slice(0, 2).map((p: any, i: number) => (
                    <Badge key={i} variant="outline" className="text-[9px]">
                      {p.degree}
                    </Badge>
                  ))}
                  {(uni.programs?.length || 0) > 2 && (
                    <span className="text-[10px] font-black text-slate-300 uppercase ml-1">+{uni.programs.length - 2} More</span>
                  )}
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <a 
                  href={uni.website} 
                  target="_blank" 
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm"
                >
                  <Globe size={18} />
                </a>
                <Link href={`/universities/${uni._id}`}>
                  <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary-700 group/btn">
                    Details
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data?.universities?.length === 0 && (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center shadow-soft">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
            <School size={48} className="text-slate-200" />
          </div>
          <div className="max-w-md mx-auto space-y-2 mb-10">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No Institutions Found</h3>
            <p className="text-sm font-medium text-slate-400">Our deep intelligence systems couldn't find any universities matching your specific criteria.</p>
          </div>
          <Button variant="outline" onClick={() => { setSearch(""); setCountry(""); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
