import React from 'react';
import { Clock, Wrench, CheckCircle2 } from 'lucide-react';

export function StatusBadge({ status, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  switch (status) {
    case 'Reported':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm ${sizeClasses[size]}`}
        >
          <Clock className={`${iconSizes[size]} text-amber-500`} />
          <span>Reported</span>
        </span>
      );
    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm ${sizeClasses[size]}`}
        >
          <Wrench className={`${iconSizes[size]} text-blue-500`} />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm ${sizeClasses[size]}`}
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-600`} />
          <span>Resolved</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
}
