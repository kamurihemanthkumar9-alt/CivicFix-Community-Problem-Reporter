import React from 'react';
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Search,
  ShieldCheck,
  RotateCcw,
  Info,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, onOpenReportModal, onResetDemoData, totalReportsCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: totalReportsCount },
    { id: 'map', label: 'Community Map', icon: Map },
    { id: 'report', label: 'Report a Problem', icon: PlusCircle, isAction: true },
    { id: 'tracker', label: 'Track Complaint', icon: Search },
    { id: 'admin', label: 'Admin Hub', icon: ShieldCheck, isSpecial: true }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex shrink-0">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction) {
                    onOpenReportModal();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${item.isSpecial && !isActive ? 'hover:bg-purple-50 hover:text-purple-700' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-blue-600'
                        : item.isSpecial
                        ? 'text-purple-500'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Tips Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-xs text-slate-700 space-y-2">
          <div className="font-semibold flex items-center gap-1.5 text-blue-900">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Civic Tip</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Duplicate reports within 350 meters automatically warn citizens and boost priority scoring!
          </p>
        </div>
      </div>

      {/* Footer controls (Demo reset, version) */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <button
          onClick={onResetDemoData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-dashed border-slate-200 transition-colors"
          title="Restore standard sample data (potholes, garbage, lighting)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>

        <div className="text-center text-[10px] text-slate-400 pt-1">
          CivicFix v1.0 • Hackathon Edition
        </div>
      </div>
    </aside>
  );
}
