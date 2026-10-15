import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ThumbsUp,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Maximize2,
  X
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusTimeline } from './StatusTimeline';
import { CATEGORIES } from '../../data/sampleReports';
import { useToast } from '../common/Toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const detailPinIcon = L.divIcon({
  className: 'detail-pin',
  html: `
    <div style="position: relative; width: 34px; height: 34px; transform: translate(-50%, -100%);">
      <svg viewBox="0 0 24 24" fill="#2563eb" stroke="#ffffff" stroke-width="1.8" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35)); width: 34px; height: 34px;">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.8" fill="#ffffff"/>
      </svg>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [0, 0]
});

export function ReportDetails({
  report,
  onBack,
  onUpvote,
  onOpenAdminUpdate,
  isAdmin
}) {
  const { addToast } = useToast();
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500 font-medium">No complaint selected.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === report.category) || {
    label: report.category
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(`Copied complaint link (${report.complaint_id}) to clipboard!`, 'info');
    } else {
      addToast(`Tracking ID: ${report.complaint_id}`, 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onOpenAdminUpdate(report)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Manage</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="Share complaint link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header Header Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {report.complaint_id}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                {category.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={report.status} size="lg" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Reported on {new Date(report.created_at).toLocaleDateString()} at {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">{report.location_name}</span>
            </span>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description, Photo, Official Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Citizen Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {report.description}
              </p>
            </div>

            {/* Photo Section */}
            {report.photo_url && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Uploaded Photo Proof</span>
                  <button
                    onClick={() => setIsPhotoExpanded(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>View Fullscreen</span>
                  </button>
                </h3>
                <div
                  onClick={() => setIsPhotoExpanded(true)}
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group relative max-h-80"
                >
                  <img
                    src={report.photo_url}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      Click to expand
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Resolution Comment / Official update */}
            {report.resolution_comment && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official Municipal Update & Action</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {report.resolution_comment}
                </p>
              </div>
            )}

            {/* Lifecycle Progress Timeline */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Resolution Timeline & Audit Trail
              </h3>
              <StatusTimeline
                currentStatus={report.status}
                history={report.status_history || []}
              />
            </div>
          </div>

          {/* Right Column: Location Map, Priority Score, Community Confirmation */}
          <div className="space-y-6">
            {/* Community Upvote Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950">Community Impact</span>
                <span className="text-xs font-extrabold text-blue-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                  {report.upvotes || 0} Confirmations
                </span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                Are you also affected by this issue? Confirm it to increase its priority for municipal maintenance crews.
              </p>
              <button
                type="button"
                onClick={() => onUpvote(report.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>I Also Face This Problem (+1)</span>
              </button>
            </div>

            {/* Priority Score Breakdown */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Priority Scoring
                </span>
                <PriorityBadge
                  urgency={report.urgency}
                  score={report.priority_score}
                  reasons={report.score_reasons}
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-xs font-semibold text-slate-700">Scoring Model Factors:</p>
                {report.score_reasons && report.score_reasons.length > 0 ? (
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    {report.score_reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    Calculated based on {report.urgency} urgency ({report.priority_score}/10 points).
                  </p>
                )}
              </div>
            </div>

            {/* Mini Map Location Card */}
            {report.latitude && report.longitude && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exact Map Location</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}
                  </span>
                </div>
                <div className="h-44 w-full">
                  <MapContainer
                    center={[report.latitude, report.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    dragging={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[report.latitude, report.longitude]}
                      icon={detailPinIcon}
                    />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isPhotoExpanded && report.photo_url && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsPhotoExpanded(false)}
        >
          <button
            onClick={() => setIsPhotoExpanded(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-slate-800/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={report.photo_url}
            alt={report.title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
