import React from 'react';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export function MetricCards({ reports = [], activeStatusFilter, onSelectStatusFilter }) {
  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Reported').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const resolved = reports.filter((r) => r.status === 'Resolved').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const cards = [
    {
      id: 'all',
      statusValue: 'all',
      title: 'Total Reports',
      count: total,
      subtext: `${resolutionRate}% resolved to date`,
      icon: FileText,
      color: 'blue',
      border: 'hover:border-blue-300',
      activeRing: 'ring-2 ring-blue-500 bg-blue-50/40'
    },
    {
      id: 'pending',
      statusValue: 'Reported',
      title: 'Pending Review',
      count: pending,
      subtext: 'Awaiting municipal intake',
      icon: Clock,
      color: 'amber',
      border: 'hover:border-amber-300',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/40'
    },
    {
      id: 'inProgress',
      statusValue: 'In Progress',
      title: 'In Progress',
      count: inProgress,
      subtext: 'Crews dispatched on-site',
      icon: Wrench,
      color: 'sky',
      border: 'hover:border-sky-300',
      activeRing: 'ring-2 ring-sky-500 bg-sky-50/40'
    },
    {
      id: 'resolved',
      statusValue: 'Resolved',
      title: 'Resolved',
      count: resolved,
      subtext: 'Verified & closed issues',
      icon: CheckCircle2,
      color: 'emerald',
      border: 'hover:border-emerald-300',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/40'
    }
  ];

  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    amber: {
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    sky: {
      bg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      badgeBg: 'bg-sky-100 text-sky-800'
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800'
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const style = colorStyles[card.color];
        const isActive = activeStatusFilter === card.statusValue;

        return (
          <div
            key={card.id}
            onClick={() => onSelectStatusFilter(isActive && card.statusValue !== 'all' ? 'all' : card.statusValue)}
            className={`cursor-pointer bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 ${card.border} ${
              isActive ? card.activeRing : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.bg}`}>
                <Icon className={`w-4 h-4 ${style.iconColor}`} />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              {card.id === 'all' && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Live
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
