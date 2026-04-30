"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "@/components/ui/Badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  FileText, 
  CreditCard, 
  FileCheck, 
  MessageSquare,
  Edit,
  MoreVertical,
  Loader2,
  ArrowLeft
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

const fetchStudent = async (id: string) => {
  const { data } = await api.get(`/students/${id}`);
  return data.data.student;
};

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "applications", label: "Applications", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FileCheck },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notes", label: "Notes", icon: MessageSquare },
];

export default function StudentProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const id = params.id;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudent(id),
  });

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  );

  if (error || !student) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
        <FileText size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900">Student not found</h3>
        <p className="text-slate-500">The student record you're looking for doesn't exist.</p>
      </div>
      <Link href="/students" className="mt-4 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-100">
        Return to List
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      <Link href="/students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Students</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary-50 border-4 border-white shadow-md flex items-center justify-center text-primary-600 text-3xl font-bold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
                <Badge variant={student.status === "enrolled" ? "success" : "warning"}>
                  {student.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5"><Mail size={14} /> {student.email}</div>
                <div className="flex items-center gap-1.5"><Phone size={14} /> {student.phone || "N/A"}</div>
                <div className="flex items-center gap-1.5"><MapPin size={14} /> {student.nationality}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
            <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative",
                isActive ? "text-primary-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details (Always visible or change based on tab) */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-6">
                <InfoCard title="Academic Background" icon={GraduationCap}>
                  <div className="space-y-4">
                    <Detail label="Education Level" value={student.educationLevel?.replace("_", " ")} />
                    <Detail label="Previous Uni" value={student.previousUniversity} />
                    <Detail label="GPA" value={student.GPA} />
                    <Detail label="Field of Study" value={student.fieldOfStudy} />
                  </div>
                </InfoCard>
                
                <InfoCard title="Personal Details" icon={Calendar}>
                  <div className="space-y-4">
                    <Detail label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"} />
                    <Detail label="Gender" value={student.gender} />
                    <Detail label="National ID" value={student.nationalId} />
                    <Detail label="Nationality" value={student.nationality} />
                  </div>
                </InfoCard>
              </div>

              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-600" />
                  Address & Contact
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mailing Address</p>
                    <p className="text-sm text-slate-700">
                      {student.address?.street}<br />
                      {student.address?.city}, {student.address?.country}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</p>
                    <p className="text-sm text-slate-700 font-bold">{student.emergencyContact?.name}</p>
                    <p className="text-xs text-slate-500">{student.emergencyContact?.phone} ({student.emergencyContact?.relation})</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white rounded-2xl border p-12 text-center text-slate-500 animate-in fade-in">
              <GraduationCap size={48} className="mx-auto mb-4 text-slate-200" />
              <p>Applications list for this student will appear here.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Stats / Tags */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Applications</span>
                <span className="text-sm font-bold text-slate-900">{student.applicationsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Documents</span>
                <span className="text-sm font-bold text-slate-900">0 / 8</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Payments</span>
                <span className="text-sm font-bold text-slate-900 text-emerald-600">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Assigned Manager</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                <Edit size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {student.assignedTo ? `${student.assignedTo.firstName} ${student.assignedTo.lastName}` : "Unassigned"}
                </p>
                <p className="text-xs text-slate-500">Employee Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Icon size={18} className="text-primary-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-700 font-medium">{value || "—"}</p>
    </div>
  );
}
