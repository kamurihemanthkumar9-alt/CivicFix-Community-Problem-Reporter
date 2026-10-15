import React from 'react';
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Search,
  ShieldCheck,
  RotateCcw,
  Database,
  X
} from 'lucide-react';
import { getSupabaseConfig } from '../../config/supabase';

export function MobileNav({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSupabaseModal,
  onResetDemoData,
  isAdmin,
  setIsAdmin
}) {
  const { isConfigured } = getSupabaseConfig();

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white z-50 p-5 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-lg">CivicFix Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleSelectTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleSelectTab('map')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'map' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4 text-blue-600" />
              <span>Community Map</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-700 bg-blue-50/70"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Report a Problem</span>
            </button>

            <button
              onClick={() => handleSelectTab('tracker')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'tracker' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Track Complaint</span>
            </button>

            <button
              onClick={() => {
                setIsAdmin(true);
                handleSelectTab('admin');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'admin' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-purple-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Management Hub</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              onOpenSupabaseModal();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Backend Mode</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              {isConfigured ? 'Supabase' : 'Demo Mode'}
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              onResetDemoData();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50/80 rounded-xl border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200/90 z-40 lg:hidden flex items-center justify-around py-2 px-3 shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'map' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 mt-1">Report</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'tracker' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>

        <button
          onClick={() => {
            setIsAdmin(true);
            setActiveTab('admin');
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'admin' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
}
