"use client";

import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  type: string;
}

const DOC_TYPES = [
  "passport", "national_id", "degree_certificate", 
  "language_certificate", "cv", "bank_statement", "photo", "other"
];

export function DocumentUploadZone({ studentId, onUploadComplete }: { studentId: string, onUploadComplete?: () => void }) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [selectedType, setSelectedType] = useState(DOC_TYPES[0]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: "pending" as const,
      type: selectedType
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, [selectedType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    
    for (const f of pendingFiles) {
      const formData = new FormData();
      formData.append("files", f.file);
      formData.append("documentType", f.type);
      formData.append("studentId", studentId);

      try {
        setFiles(prev => prev.map(item => item.file === f.file ? { ...item, status: "uploading" } : item));
        
        await axios.post("/api/documents/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
            setFiles(prev => prev.map(item => item.file === f.file ? { ...item, progress } : item));
          }
        });

        setFiles(prev => prev.map(item => item.file === f.file ? { ...item, status: "success", progress: 100 } : item));
      } catch (err) {
        setFiles(prev => prev.map(item => item.file === f.file ? { ...item, status: "error" } : item));
      }
    }
    if (onUploadComplete) onUploadComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Upload Documents</h3>
          <p className="text-sm text-slate-500">Select document type before dropping files.</p>
        </div>
        <select 
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {DOC_TYPES.map(type => (
            <option key={type} value={type}>{type.replace("_", " ").toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div 
        {...getRootProps()} 
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer",
          isDragActive ? "border-primary-500 bg-primary-50/50" : "border-slate-200 hover:border-primary-400 hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="rounded-full bg-primary-50 p-4 text-primary-600 mb-4">
          <Upload size={32} />
        </div>
        <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
        <p className="text-xs text-slate-500 mt-1 text-center">
          PDF, PNG, JPG (max. 5MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{f.file.name}</p>
                  <span className="text-[10px] font-bold text-primary-600 uppercase bg-primary-50 px-2 py-0.5 rounded">
                    {f.type.replace("_", " ")}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300",
                      f.status === "error" ? "bg-rose-500" : "bg-primary-500"
                    )} 
                    style={{ width: `${f.progress}%` }} 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {f.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-primary-600" />}
                {f.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {f.status === "error" && <AlertCircle className="h-4 w-4 text-rose-500" />}
                <button 
                  onClick={() => removeFile(i)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          <button 
            onClick={uploadFiles}
            disabled={files.every(f => f.status === "success")}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-50"
          >
            Start Upload
          </button>
        </div>
      )}
    </div>
  );
}
