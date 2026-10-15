import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  Database,
  Menu,
  X,
  MapPin,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { getSupabaseConfig } from '../../config/supabase';

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onSearchComplaintId,
  onOpenSupabaseModal,
  isAdmin,
  setIsAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) {
  const [complaintSearch, setComplaintSearch] = useState('');
  const { isConfigured } = getSupabaseConfig();

  const handleIdSearch = (e) => {
    e.preventDefault();
    if (complaintSearch.trim()) {
      onSearchComplaintId(complaintSearch.trim());
      setComplaintSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-slate-900 bg-clip-text text-transparent">
                  CivicFix
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Citizen Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Community Problem Reporter
              </p>
            </div>
          </button>
        </div>

        {/* Complaint ID Quick Search (Center) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleIdSearch} className="w-full relative">
            <input
              type="text"
              value={complaintSearch}
              onChange={(e) => setComplaintSearch(e.target.value)}
              placeholder="Track Complaint ID (e.g. CF-2026-1042)..."
              className="w-full pl-9 pr-20 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              disabled={!complaintSearch.trim()}
              className="absolute right-1.5 top-1 px-2.5 py-1 bg-slate-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 text-[11px] font-semibold text-slate-700 rounded-lg transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Action Controls & Mode Badges */}
        <div className="flex items-center gap-2.5">
          {/* Supabase / Demo Mode Pill */}
          <button
            type="button"
            onClick={onOpenSupabaseModal}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
            title="View backend configuration (Supabase or Demo localStorage)"
          >
            <Database className={`w-3.5 h-3.5 ${isConfigured ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>{isConfigured ? 'Supabase Cloud' : 'Demo Mode'}</span>
          </button>

          {/* Admin Toggle Pill */}
          <button
            type="button"
            onClick={() => {
              setIsAdmin(!isAdmin);
              if (!isAdmin) setActiveTab('admin');
              else if (activeTab === 'admin') setActiveTab('dashboard');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAdmin
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin View' : 'Admin'}</span>
          </button>

          {/* Report Problem CTA */}
          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all hover:shadow-lg active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Issue</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
