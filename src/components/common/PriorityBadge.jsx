import React, { useState } from 'react';
import { Flame, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

export function PriorityBadge({ urgency = 'Medium', score = 3, reasons = [], showScore = true }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const urgencyStyles = {
    Low: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      icon: null
    },
    Medium: {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      icon: <AlertTriangle className="w-3 h-3 text-amber-600 inline mr-1" />
    },
    High: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      icon: <Flame className="w-3 h-3 text-rose-600 inline mr-1" />
    }
  };

  const current = urgencyStyles[urgency] || urgencyStyles.Medium;

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm ${current.badge}`}
      >
        {current.icon}
        {urgency} Urgency
      </span>

      {showScore && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`group flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-all border ${
            score >= 8
              ? 'bg-rose-100/90 text-rose-800 border-rose-300'
              : score >= 5
              ? 'bg-amber-100/90 text-amber-800 border-amber-300'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
          title="Click to view Priority Score rationale"
        >
          <span>Score: {score}/10</span>
          <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
      )}

      {/* Rationale Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-0 mb-2 w-64 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 border border-slate-800 pointer-events-none transition-all duration-150"
          style={{ transform: 'translateX(-10%)' }}
        >
          <div className="font-semibold text-slate-100 flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart Priority Model: {score}/10</span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-slate-300 font-medium">Why this score?</p>
            {reasons && reasons.length > 0 ? (
              <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-[11px]">
                Base urgency: {urgency} ({score} pts) + hazard & community weight.
              </p>
            )}
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 italic">
            Used to prioritize dispatch queues for public safety.
          </div>
        </div>
      )}
    </div>
  );
}
