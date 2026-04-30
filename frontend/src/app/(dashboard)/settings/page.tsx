"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/PageHeader";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  ShieldCheck,
  Save,
  Trash2,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Globe },
  ];

  const handleSave = () => {
    toast.success("Settings Saved", {
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your account preferences and system configurations."
      >
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-100" 
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm">
            
            {activeTab === 'profile' && (
              <div className="space-y-12">
                <section>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Personal Information</h3>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="relative group">
                       <div className="h-24 w-24 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                          <User size={40} />
                       </div>
                       <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                          <Camera size={16} />
                       </button>
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900">Profile Photo</p>
                       <p className="text-xs text-slate-400 font-medium">Upload a professional photo for your CRM profile.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                       <input type="text" defaultValue="Admin" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                       <input type="text" defaultValue="User" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                       <input type="email" defaultValue="admin@study-crm.com" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <section>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Password Management</h3>
                  <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current Password</label>
                       <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm New Password</label>
                         <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-50" />

                <section>
                  <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                           <ShieldCheck size={28} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-slate-900 tracking-tight">Two-Factor Authentication</h4>
                           <p className="text-xs text-slate-400 font-medium">Add an extra layer of security to your account.</p>
                        </div>
                     </div>
                     <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Enable</button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Notification Preferences</h3>
                <div className="divide-y divide-slate-50">
                   {[
                     { id: 'n1', label: 'Application Status Updates', desc: 'Notify me when an application status changes.', default: true },
                     { id: 'n2', label: 'Payment Alerts', desc: 'Get notified for new payments or overdue invoices.', default: true },
                     { id: 'n3', label: 'Student Messages', desc: 'Direct alerts for new messages from students.', default: false },
                     { id: 'n4', label: 'Marketing Reports', desc: 'Receive weekly performance analytics summaries.', default: false },
                   ].map((item) => (
                     <div key={item.id} className="py-8 flex items-center justify-between">
                        <div>
                           <h4 className="text-sm font-black text-slate-900 mb-1">{item.label}</h4>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                          <div className="w-14 h-8 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600 shadow-inner"></div>
                        </label>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-12">
                <section className="space-y-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">System Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Default Currency</label>
                       <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none">
                          <option>USD ($)</option>
                          <option>GBP (£)</option>
                          <option>EUR (€)</option>
                          <option>CAD ($)</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Language</label>
                       <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none">
                          <option>English (US)</option>
                          <option>Arabic (العربية)</option>
                          <option>German (Deutsch)</option>
                       </select>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-50" />

                <section>
                   <h3 className="text-2xl font-black text-rose-600 tracking-tight mb-8">Danger Zone</h3>
                   <div className="p-8 border-2 border-dashed border-rose-100 rounded-[2rem] bg-rose-50/30 flex items-center justify-between">
                      <div>
                         <h4 className="text-sm font-black text-slate-900 mb-1">Delete Account</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">This action is permanent and cannot be undone.</p>
                      </div>
                      <button className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 transition-all hover:bg-rose-700">
                         <Trash2 size={16} /> Delete Account
                      </button>
                   </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
