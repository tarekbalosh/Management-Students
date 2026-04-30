"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { 
  Building, 
  MapPin, 
  Globe, 
  Trophy, 
  GraduationCap, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Mail,
  Loader2,
  ExternalLink,
  Plus
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const fetchUniversity = async (id: string) => {
  const { data } = await api.get(`/universities/${id}`);
  return data.data.university;
};

export default function UniversityDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const id = params.id;

  const { data: uni, isLoading, error } = useQuery({
    queryKey: ["university", id],
    queryFn: () => fetchUniversity(id),
  });

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;

  if (error || !uni) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Building size={48} className="text-slate-200" />
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900">University not found</h3>
        <p className="text-slate-500">The university you're looking for doesn't exist or has been removed.</p>
      </div>
      <Link href="/universities" className="mt-4 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-100">
        Return to Catalog
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation */}
      <Link href="/universities" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </Link>

      {/* Header Profile */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="h-48 bg-slate-100 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 flex items-center gap-6">
            <div className="h-24 w-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center">
              <Building size={48} className="text-primary-600" />
            </div>
            <div className="text-white space-y-1">
              <h1 className="text-3xl font-bold">{uni.name}</h1>
              <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {uni.city}, {uni.country}</span>
                <span className="flex items-center gap-1.5"><Trophy size={16} /> World Rank #{uni.ranking?.world || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-8 py-4 bg-white">
          <div className="flex items-center gap-8">
            <a href={uni.website} target="_blank" className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:underline">
              <Globe size={16} /> Official Website
            </a>
            <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Mail size={16} /> {uni.contactEmail || "contact@university.edu"}
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
            <Plus size={18} />
            <span>Add Program</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Programs List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={24} className="text-primary-600" />
              Academic Programs
            </h2>
            <Badge variant="default" className="px-3 py-1">{uni.programs?.length || 0} Total</Badge>
          </div>

          <DataTable 
            columns={["Program Name", "Degree", "Duration", "Tuition Fee", ""]}
            isEmpty={uni.programs?.length === 0}
          >
            {uni.programs?.map((prog: any) => (
              <tr key={prog._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-900">{prog.name}</p>
                    <p className="text-xs text-slate-500">{prog.fieldOfStudy}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="uppercase text-[10px]">{prog.degree}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    {prog.durationMonths} Months
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                    <DollarSign size={14} />
                    {prog.tuitionFee.toLocaleString()} {prog.currency}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary-600 hover:underline text-xs font-bold flex items-center gap-1 justify-end ml-auto">
                    APPLY <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Sidebar: Details & Highlights */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 border-b pb-4">University Details</h3>
            
            <div className="space-y-4">
              <DetailItem label="Location" value={`${uni.city}, ${uni.country}`} icon={MapPin} />
              <DetailItem label="Establishment" value={uni.establishmentYear || "N/A"} icon={Building} />
              <DetailItem label="National Rank" value={`#${uni.ranking?.national || "N/A"}`} icon={Trophy} />
              <DetailItem label="Programs Offered" value={uni.programs?.length || 0} icon={GraduationCap} />
            </div>
          </div>

          <div className="bg-primary-600 rounded-2xl p-6 shadow-lg shadow-primary-100 text-white space-y-4">
            <h3 className="font-bold text-lg">Admission Help</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Need assistance with the application process for this university? Our experts are here to help.
            </p>
            <button className="w-full bg-white text-primary-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-50 transition-all">
              Request Consultant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
