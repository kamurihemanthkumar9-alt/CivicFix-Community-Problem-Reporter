import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle, MapPin, Eye, ArrowRight, CheckCircle2, ThumbsUp } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function DuplicateModal({
  isOpen,
  onClose,
  duplicates = [],
  onProceedAnyway,
  onViewExisting,
  onUpvoteExisting
}) {
  if (!isOpen || duplicates.length === 0) return null;

  const topMatch = duplicates[0];
  const existing = topMatch.report;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Possible Duplicate Issue Detected"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Alert Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-amber-950">
              A similar complaint already exists nearby!
            </p>
            <p className="text-amber-800 leading-relaxed">
              {topMatch.reason}. Submitting duplicates can split municipal dispatch attention. You can view or confirm the existing report to escalate its priority score instead.
            </p>
          </div>
        </div>

        {/* Existing report preview card */}
        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {existing.complaint_id}
            </span>
            <StatusBadge status={existing.status} size="sm" />
          </div>

          <div className="flex gap-3 items-start">
            {existing.photo_url && (
              <img
                src={existing.photo_url}
                alt={existing.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {existing.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {existing.description}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{existing.location_name}</span>
                {topMatch.distanceMeters != null && (
                  <span className="text-amber-700 font-semibold bg-amber-100/80 px-1.5 py-0.2 rounded text-[10px]">
                    ~{topMatch.distanceMeters}m away
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onProceedAnyway}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors order-2 sm:order-1"
          >
            It's a Different Issue • Submit Anyway
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              onClick={() => {
                onUpvoteExisting(existing.id);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Confirm & Boost Priority (+1)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onViewExisting(existing);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Existing</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
