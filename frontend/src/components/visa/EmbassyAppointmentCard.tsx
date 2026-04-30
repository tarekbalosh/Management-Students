"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Bell, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface EmbassyAppointmentCardProps {
  appointmentDate: string;
  location: string;
  embassyName: string;
  onToggleReminder: (active: boolean) => void;
}

export function EmbassyAppointmentCard({ 
  appointmentDate, 
  location, 
  embassyName,
  onToggleReminder 
}: EmbassyAppointmentCardProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const date = new Date(appointmentDate);
    const updateTime = () => {
      const now = new Date();
      if (isAfter(now, date)) {
        setIsPast(true);
        setTimeLeft("Appointment passed");
      } else {
        setIsPast(false);
        setTimeLeft(formatDistanceToNow(date, { addSuffix: true }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [appointmentDate]);

  const handleReminderToggle = () => {
    const newValue = !isReminderActive;
    setIsReminderActive(newValue);
    onToggleReminder(newValue);
  };

  return (
    <div className={cn(
      "rounded-3xl border-2 p-6 transition-all duration-500",
      isPast ? "bg-slate-50 border-slate-100 opacity-80" : "bg-gradient-to-br from-white to-primary-50/30 border-primary-100 shadow-xl shadow-primary-50/50"
    )}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110",
            isPast ? "bg-slate-200 text-slate-500" : "bg-primary-600 text-white"
          )}>
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Embassy Appointment</h4>
            <p className="text-xs text-slate-500 font-medium">{embassyName}</p>
          </div>
        </div>
        {!isPast && (
          <button 
            onClick={handleReminderToggle}
            className={cn(
              "p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs",
              isReminderActive ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200" : "bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200"
            )}
          >
            <Bell size={16} className={cn(isReminderActive && "animate-bounce")} />
            {isReminderActive ? "Reminder On" : "Set Reminder"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">When</p>
              <p className="text-sm font-bold text-slate-800">
                {new Date(appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <p className={cn("text-xs font-medium", isPast ? "text-slate-400" : "text-primary-600")}>
                {timeLeft}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <MapPin size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Where</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800 truncate pr-2">{location}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 transition-colors p-1"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-primary-50 flex flex-col justify-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Pro-Tip</p>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Arrive at least 30 minutes early with all original documents organized in a clear folder."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
