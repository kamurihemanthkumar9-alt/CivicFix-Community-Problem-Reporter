import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CATEGORIES } from '../../data/sampleReports';

const COLORS = ['#f97316', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];

export function CategoryChart({ reports = [] }) {
  const categoryCounts = CATEGORIES.map((cat, idx) => {
    const count = reports.filter((r) => r.category === cat.id).length;
    return {
      name: cat.label.split('&')[0].trim(),
      fullName: cat.label,
      value: count,
      color: COLORS[idx % COLORS.length]
    };
  }).filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-xl border border-slate-800">
          <p className="font-semibold text-slate-100">{data.fullName}</p>
          <p className="text-slate-300 mt-1">
            <span className="font-bold text-white">{data.value}</span> report
            {data.value > 1 ? 's' : ''} ({Math.round((data.value / reports.length) * 100) || 0}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryCounts.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No category data available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryCounts}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {categoryCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
