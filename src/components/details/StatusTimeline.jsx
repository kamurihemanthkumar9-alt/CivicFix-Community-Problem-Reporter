import React from 'react';
import { CheckCircle2, Clock, Wrench, Shield, CircleDot, ArrowRight } from 'lucide-react';

export function StatusTimeline({ currentStatus = 'Reported', history = [] }) {
  const steps = [
    {
      id: 'Reported',
      label: '1. Problem Reported',
      desc: 'Logged & queued for inspection',
      icon: Clock
    },
    {
      id: 'In Progress',
      label: '2. Work In Progress',
      desc: 'Maintenance crew dispatched',
      icon: Wrench
    },
    {
      id: 'Resolved',
      label: '3. Resolved & Closed',
      desc: 'Repairs verified completed',
      icon: CheckCircle2
    }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Reported':
        return 0;
      case 'In Progress':
        return 1;
      case 'Resolved':
        return 2;
      default:
        return 0;
    }
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Horizontal Progress Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: currentIdx === 0 ? '0%' : currentIdx === 1 ? '50%' : '100%'
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white border-slate-300 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-bold mt-2 ${
                  isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block max-w-[110px] mt-0.5">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit History Log */}
      {history && history.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Official Status History</span>
          </h4>
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 pl-7">
            {history.map((item, index) => (
              <div key={item.id || index} className="relative text-xs">
                {/* Timeline node dot */}
                <div className="absolute -left-7 top-1 w-3 h-3 rounded-full border-2 border-white bg-blue-600 ring-2 ring-blue-200" />
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800">
                      Status set to <span className="text-blue-600 font-bold">{item.status}</span>
                    </span>
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  {item.comment && (
                    <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">
                      "{item.comment}"
                    </p>
                  )}
                  {item.changed_by && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Updated by: {item.changed_by}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
