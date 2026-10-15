import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';

export function PriorityChart({ reports = [] }) {
  const urgencies = ['Low', 'Medium', 'High'];

  const data = urgencies.map((urg) => {
    const matching = reports.filter((r) => (r.urgency || 'Medium') === urg);
    return {
      urgency: `${urg} Urgency`,
      Reported: matching.filter((r) => r.status === 'Reported').length,
      InProgress: matching.filter((r) => r.status === 'In Progress').length,
      Resolved: matching.filter((r) => r.status === 'Resolved').length
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-800 space-y-1">
          <p className="font-semibold text-slate-100 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name === 'InProgress' ? 'In Progress' : entry.name}:</span>
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="urgency"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            formatter={(value) => (value === 'InProgress' ? 'In Progress' : value)}
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
          <Bar dataKey="Reported" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="InProgress" fill="#3b82f6" radius={[0, 0, 0, 0]} stackId="a" />
          <Bar dataKey="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
