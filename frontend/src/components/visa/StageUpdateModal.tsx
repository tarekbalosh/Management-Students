"use client";

import { useState } from "react";
import { X, Calendar, MapPin, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { VisaStage } from "@/types/visa";
import { cn } from "@/lib/utils";

interface StageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentStage: VisaStage;
}

const STAGES: { value: VisaStage; label: string }[] = [
  { value: "documents_preparation", label: "Documents Preparation" },
  { value: "documents_submitted", label: "Documents Submitted" },
  { value: "embassy_appointment", label: "Embassy Appointment" },
  { value: "interview_completed", label: "Interview Completed" },
  { value: "visa_approved", label: "Visa Approved" },
  { value: "visa_rejected", label: "Visa Rejected" },
  { value: "visa_collected", label: "Visa Collected" },
];

export function StageUpdateModal({ isOpen, onClose, onSubmit, currentStage }: StageUpdateModalProps) {
  const [stage, setStage] = useState<VisaStage>(currentStage);
  const [notes, setNotes] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [visaNumber, setVisaNumber] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      stage,
      notes,
      appointmentDate,
      appointmentLocation,
      visaNumber,
      validFrom,
      validTo,
      rejectionReason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Update Visa Stage</h3>
            <p className="text-xs text-slate-500 mt-1">Advance the tracking to the next milestone</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Stage Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">New Stage</label>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as VisaStage)}
                className="w-full rounded-2xl border-slate-200 border-2 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none appearance-none"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Fields based on Stage */}
          {stage === "embassy_appointment" && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 border-2 pl-12 pr-4 py-3 text-sm focus:border-primary-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Embassy address"
                    value={appointmentLocation}
                    onChange={(e) => setAppointmentLocation(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 border-2 pl-12 pr-4 py-3 text-sm focus:border-primary-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {stage === "visa_approved" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Visa Number</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="E.g. V12345678"
                    value={visaNumber}
                    onChange={(e) => setVisaNumber(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 border-2 pl-12 pr-4 py-3 text-sm focus:border-primary-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Valid From</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3 text-sm focus:border-primary-500 transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Valid Until</label>
                  <input
                    type="date"
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3 text-sm focus:border-primary-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {stage === "visa_rejected" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Rejection Reason</label>
              <textarea
                placeholder="Details about the rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-2xl border-slate-200 border-2 p-4 text-sm focus:border-primary-500 transition-all outline-none h-24 resize-none"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Internal Notes</label>
            <textarea
              placeholder="Add any additional context or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border-slate-200 border-2 p-4 text-sm focus:border-primary-500 transition-all outline-none h-24 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
