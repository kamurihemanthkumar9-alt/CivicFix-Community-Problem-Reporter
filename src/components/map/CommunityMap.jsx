import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '../../data/sampleReports';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  X
} from 'lucide-react';

// Status color-coded pin creator
const createStatusPin = (status = 'Reported') => {
  let color = '#f59e0b'; // Amber for Reported
  let badgeLetter = 'R';

  if (status === 'In Progress') {
    color = '#2563eb'; // Blue
    badgeLetter = 'P';
  } else if (status === 'Resolved') {
    color = '#059669'; // Emerald
    badgeLetter = '✓';
  }

  return L.divIcon({
    className: 'custom-status-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; transform: translate(-50%, -100%); cursor: pointer;">
        <svg viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.8" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); width: 36px; height: 36px;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36]
  });
};

function AutoFitBounds({ reports }) {
  const map = useMap();

  useEffect(() => {
    const validCoords = reports
      .filter((r) => r.latitude && r.longitude)
      .map((r) => [r.latitude, r.longitude]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, map]);

  return null;
}

export function CommunityMap({ reports = [], onSelectReport, onOpenReportModal }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedUrgency !== 'all' && (r.urgency || 'Medium') !== selectedUrgency) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title?.toLowerCase().includes(q);
        const matchesLoc = r.location_name?.toLowerCase().includes(q);
        const matchesId = r.complaint_id?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesId) return false;
      }
      return true;
    });
  }, [reports, selectedCategory, selectedStatus, selectedUrgency, searchQuery]);

  // Reports with valid coordinates
  const mappedReports = useMemo(() => {
    return filteredReports.filter((r) => r.latitude != null && r.longitude != null);
  }, [filteredReports]);

  const defaultCenter = [37.781, -122.414];

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-5.5rem)] flex flex-col relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
      {/* Floating Map Filter Header */}
      <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Quick Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pins on map..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported (Amber)</option>
            <option value="In Progress">In Progress (Blue)</option>
            <option value="Resolved">Resolved (Green)</option>
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Urgencies</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Low">Low Urgency</option>
          </select>
        </div>

        {/* Legend & Count */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Reported</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>In Progress</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Resolved</span>
            </span>
          </div>

          <span className="text-xs font-bold text-slate-700">
            Showing <span className="text-blue-600 font-extrabold">{mappedReports.length}</span> marker{mappedReports.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Leaflet Map */}
      <div className="flex-1 w-full relative">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AutoFitBounds reports={mappedReports} />

          {mappedReports.map((report) => {
            const cat = CATEGORIES.find((c) => c.id === report.category) || { label: report.category };
            return (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createStatusPin(report.status)}
              >
                <Popup className="civic-popup" minWidth={260} maxWidth={320}>
                  <div className="p-3.5 space-y-2.5 text-left font-sans">
                    {/* Header: ID and Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {report.complaint_id}
                      </span>
                      <StatusBadge status={report.status} size="sm" />
                    </div>

                    {/* Image if present */}
                    {report.photo_url && (
                      <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={report.photo_url}
                          alt={report.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Title & Category */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                        {cat.label}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug mt-0.5">
                        {report.title}
                      </h4>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{report.location_name}</span>
                    </div>

                    {/* Urgency & Priority */}
                    <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100">
                      <PriorityBadge
                        urgency={report.urgency}
                        score={report.priority_score}
                        reasons={report.score_reasons}
                      />
                    </div>

                    {/* Open full report */}
                    <button
                      type="button"
                      onClick={() => onSelectReport(report)}
                      className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                      <span>View Full Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Empty state overlay if zero markers */}
        {mappedReports.length === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center max-w-sm pointer-events-auto">
              <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-900 text-sm">No Matching Issues on Map</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing active filters or report a new problem in your community.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedUrgency('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700"
              >
                Clear Map Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
