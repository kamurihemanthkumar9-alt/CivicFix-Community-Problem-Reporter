import React, { useState } from 'react';
import { Search, ShieldAlert, ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export function ComplaintTracker({ onSearchId, reports = [], onSelectReport }) {
  const [inputId, setInputId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputId.trim()) {
      setErrorMsg('Please enter a Complaint ID.');
      return;
    }
    const found = reports.find(
      (r) => r.complaint_id?.toLowerCase() === inputId.trim().toLowerCase()
    );

    if (found) {
      setErrorMsg('');
      onSelectReport(found);
    } else {
      setErrorMsg(`No complaint found with ID "${inputId.trim()}". Please check your ID and try again.`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 sm:py-8">
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Track Your Complaint
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Check real-time municipal inspection progress, dispatched work orders, and official resolution updates.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Enter Complaint Tracking ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. CF-2026-1042"
              className="w-full pl-10 pr-28 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Track Now
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
            {errorMsg}
          </p>
        )}

        {/* Quick sample chips */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-2">Try sample IDs:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {reports.slice(0, 4).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setInputId(r.complaint_id);
                  onSelectReport(r);
                }}
                className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200/60 transition-colors"
              >
                {r.complaint_id}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
