import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RotateCcw,
  Clock,
  Wrench,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  Edit,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusUpdateModal } from './StatusUpdateModal';
import { CATEGORIES } from '../../data/sampleReports';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

export function AdminDashboard({
  reports = [],
  onUpdateStatus,
  onUpdatePriority,
  onResetDemoData,
  onSelectReport
}) {
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // default sort by highest priority in admin
  const [editingReport, setEditingReport] = useState(null);

  // Filtered & sorted reports
  const filteredReports = useMemo(() => {
    let result = reports.filter((r) => {
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title?.toLowerCase().includes(q);
        const matchId = r.complaint_id?.toLowerCase().includes(q);
        const matchLoc = r.location_name?.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchLoc) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priority_score || 0) - (a.priority_score || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

    return result;
  }, [reports, searchQuery, selectedStatus, selectedCategory, sortBy]);

  // Summary Metrics
  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Reported').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;
  const avgPriority = total > 0 ? (reports.reduce((acc, r) => acc + (r.priority_score || 0), 0) / total).toFixed(1) : 0;

  // CSV Export
  const handleExportCSV = () => {
    const csvContent = db.exportReportsCSV(filteredReports);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `civicfix-reports-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Complaint records exported to CSV successfully', 'success');
  };

  const handleQuickStatus = async (report, newStatus) => {
    if (report.status === newStatus) return;
    try {
      await onUpdateStatus({
        id: report.id,
        status: newStatus,
        comment: `Quick status change to ${newStatus}`,
        changedBy: 'Admin (Quick Action)'
      });
      addToast(`Updated ${report.complaint_id} status to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Admin Mode Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-400/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Admin Management Hub</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Demo Mode Interface
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Review incoming issues, adjust priorities, issue resolution notes, and dispatch municipal work orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onResetDemoData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-xl border border-rose-400/30 transition-colors"
            title="Reset to default sample reports"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Admin Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          <span className="text-[11px] text-slate-400">All registered issues</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Review</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pending}</div>
          <span className="text-[11px] text-amber-600/80">Needs triage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgress}</div>
          <span className="text-[11px] text-blue-600/80">Dispatched crews</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolved}</div>
          <span className="text-[11px] text-emerald-600/80">Closed & verified</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-purple-200/80 bg-purple-50/20 shadow-xs">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Avg Priority Score</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{avgPriority} / 10</div>
          <span className="text-[11px] text-purple-600/80">Based on hazard & impact</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or ID..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 cursor-pointer"
          >
            <option value="priority">Priority Score (Highest First)</option>
            <option value="newest">Submission Date (Newest First)</option>
            <option value="oldest">Submission Date (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Issue Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Quick Status Transition</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.map((report) => {
                const cat = CATEGORIES.find((c) => c.id === report.category) || { label: report.category };

                return (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {report.complaint_id}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Title, Photo, Location */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        {report.photo_url && (
                          <img
                            src={report.photo_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{report.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{report.location_name}</p>
                          {report.resolution_comment && (
                            <p className="text-[10px] text-emerald-700 italic truncate mt-0.5">
                              Note: {report.resolution_comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {cat.label}
                      </span>
                    </td>

                    {/* Priority & Urgency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge
                        urgency={report.urgency}
                        score={report.priority_score}
                        reasons={report.score_reasons}
                      />
                    </td>

                    {/* Current Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    {/* Quick status transition buttons */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(report, 'Reported')}
                          disabled={report.status === 'Reported'}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            report.status === 'Reported'
                              ? 'bg-amber-100 text-amber-800 cursor-default opacity-80'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600'
                          }`}
                        >
                          Reported
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(report, 'In Progress')}
                          disabled={report.status === 'In Progress'}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            report.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 cursor-default opacity-80'
                              : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(report, 'Resolved')}
                          disabled={report.status === 'Resolved'}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            report.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800 cursor-default opacity-80'
                              : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
                          }`}
                        >
                          Resolved
                        </button>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectReport(report)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View public details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingReport(report)}
                          className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1"
                          title="Edit status and resolution comment"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No complaints found matching your filters.
          </div>
        )}
      </div>

      {/* Edit modal */}
      <StatusUpdateModal
        isOpen={Boolean(editingReport)}
        onClose={() => setEditingReport(null)}
        report={editingReport}
        onSaveStatus={async ({ id, status, urgency, comment, changedBy }) => {
          await onUpdateStatus({ id, status, comment, changedBy });
          if (urgency && urgency !== editingReport.urgency) {
            await onUpdatePriority(id, urgency);
          }
          addToast('Report updated successfully', 'success');
        }}
      />
    </div>
  );
}
