import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { STATUS_OPTIONS, URGENCY_OPTIONS } from '../../data/sampleReports';
import { ShieldCheck, MessageSquare, AlertCircle, Save } from 'lucide-react';

export function StatusUpdateModal({ isOpen, onClose, report, onSaveStatus }) {
  if (!report) return null;

  const [status, setStatus] = useState(report.status || 'Reported');
  const [urgency, setUrgency] = useState(report.urgency || 'Medium');
  const [comment, setComment] = useState(report.resolution_comment || '');
  const [changedBy, setChangedBy] = useState('Municipal Public Works');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (report) {
      setStatus(report.status || 'Reported');
      setUrgency(report.urgency || 'Medium');
      setComment(report.resolution_comment || '');
    }
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveStatus({
        id: report.id,
        status,
        urgency,
        comment,
        changedBy
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update report');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Complaint ${report.complaint_id}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="font-bold text-xs text-slate-800 line-clamp-1">{report.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{report.location_name}</p>
        </div>

        {/* Change Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Complaint Status *
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStatus(opt.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  status === opt.id
                    ? opt.id === 'Resolved'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : opt.id === 'In Progress'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Adjust Urgency */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Urgency Priority
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setUrgency(opt.id)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  urgency === opt.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>
        </div>

        {/* Official Resolution Comment */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Official Note / Resolution Comment</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Visible to citizens</span>
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="e.g. Work Order #PW-491 dispatched. Asphalt cold-patch applied and curing verified..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 text-slate-800"
          />
        </div>

        {/* Changed By Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Sign-off Inspector / Dept Name
          </label>
          <input
            type="text"
            value={changedBy}
            onChange={(e) => setChangedBy(e.target.value)}
            placeholder="e.g. Sanitation Supervisor, Ward 4"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Updating...' : 'Save & Publish Update'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
