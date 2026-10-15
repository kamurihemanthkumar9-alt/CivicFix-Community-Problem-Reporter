import React from 'react';
import {
  MapPin,
  ThumbsUp,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CATEGORIES } from '../../data/sampleReports';

export function ReportCard({ report, onSelectReport, onUpvote }) {
  const categoryInfo = CATEGORIES.find((c) => c.id === report.category) || {
    label: report.category,
    color: 'slate'
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div
      onClick={() => onSelectReport(report)}
      className="group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Top row: ID, Category, Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
            {report.complaint_id}
          </span>
          <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
            {categoryInfo.label}
          </span>
        </div>
        <StatusBadge status={report.status} size="sm" />
      </div>

      {/* Main content: Thumbnail and Title */}
      <div className="mt-3.5 flex gap-3.5 items-start">
        {/* Photo thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 relative">
          {report.photo_url ? (
            <img
              src={report.photo_url}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-2 text-center text-[10px]">
              <ShieldAlert className="w-5 h-5 mb-1 text-slate-300" />
              <span>No image</span>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {report.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {report.description}
          </p>

          {/* Location row */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{report.location_name}</span>
          </div>
        </div>
      </div>

      {/* Resolution comment preview if available */}
      {report.resolution_comment && (
        <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-slate-700 flex items-start gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="line-clamp-1 text-[11px] italic">
            <span className="font-semibold not-italic text-slate-800">Municipal update:</span> {report.resolution_comment}
          </p>
        </div>
      )}

      {/* Bottom row: Priority, Upvotes, Time, View action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PriorityBadge
            urgency={report.urgency}
            score={report.priority_score}
            reasons={report.score_reasons}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(report.id);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
            title="Confirm / Upvote this problem"
          >
            <ThumbsUp className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
            <span>{report.upvotes || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(report.created_at)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
