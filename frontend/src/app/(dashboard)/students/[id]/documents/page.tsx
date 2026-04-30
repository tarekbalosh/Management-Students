"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PageHeader } from "@/components/ui/PageHeader";
import { DocumentUploadZone } from "@/components/documents/DocumentUploadZone";
import { DocumentsGallery } from "@/components/documents/DocumentsGallery";
import { DocumentPreviewModal } from "@/components/documents/DocumentPreviewModal";
import { 
  ArrowLeft, 
  Loader2, 
  Files, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

const fetchStudentDocs = async (studentId: string) => {
  const { data } = await api.get(`/documents/${studentId}`);
  return data.data;
};

export default function StudentDocumentsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const id = params.id;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["student-documents", id],
    queryFn: () => fetchStudentDocs(id),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, reason }: any) => api.patch(`/documents/${id}/status`, { status, rejectionReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-documents", id] });
      setIsPreviewOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => api.delete(`/documents/${docId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-documents", id] }),
  });

  const onDownload = (doc: any) => {
    window.open(`/api/documents/file/${doc._id}`, "_blank");
  };

  const handlePreview = (doc: any) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  if (isLoading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary-600" /></div>;

  const stats = {
    total: documents?.length || 0,
    verified: documents?.filter((d: any) => d.status === "verified").length || 0,
    pending: documents?.filter((d: any) => d.status === "pending").length || 0,
    rejected: documents?.filter((d: any) => d.status === "rejected").length || 0,
  };

  return (
    <div className="space-y-8 pb-20">
      <Link href={`/students/${params.id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} />
        Back to Profile
      </Link>

      <PageHeader 
        title="Document Management" 
        subtitle="Upload, verify, and manage all student documentation."
      />

      {/* Stats Row */}
      <div className="grid gap-6 sm:grid-cols-4">
        <StatItem label="Total" value={stats.total} icon={Files} color="text-primary-600" />
        <StatItem label="Verified" value={stats.verified} icon={CheckCircle2} color="text-emerald-600" />
        <StatItem label="Pending" value={stats.pending} icon={Clock} color="text-amber-600" />
        <StatItem label="Rejected" value={stats.rejected} icon={AlertCircle} color="text-rose-600" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Gallery */}
        <div className="lg:col-span-2">
          <DocumentsGallery 
            documents={documents || []} 
            onPreview={handlePreview}
            onDownload={onDownload}
            onDelete={(id) => { if(confirm("Delete this document?")) deleteMutation.mutate(id); }}
          />
        </div>

        {/* Upload Side */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <DocumentUploadZone 
              studentId={params.id} 
              onUploadComplete={() => queryClient.invalidateQueries({ queryKey: ["student-documents", params.id] })} 
            />
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
            <h4 className="font-bold">Required Documents</h4>
            <div className="space-y-4">
              {[
                { name: "Passport Copy", status: "verified" },
                { name: "IELTS Certificate", status: "pending" },
                { name: "Bank Statement", status: "missing" },
                { name: "Degree Transcript", status: "verified" },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-80">{req.name}</span>
                  {req.status === "verified" ? <CheckCircle2 size={16} className="text-emerald-400" /> : 
                   req.status === "pending" ? <Clock size={16} className="text-amber-400" /> : 
                   <div className="h-2 w-2 rounded-full bg-rose-400" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DocumentPreviewModal 
        isOpen={isPreviewOpen} 
        document={selectedDoc} 
        onClose={() => setIsPreviewOpen(false)}
        onDownload={onDownload}
        onStatusUpdate={(id, status, reason) => statusMutation.mutate({ id, status, reason })}
      />
    </div>
  );
}

function StatItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-4">
      <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
