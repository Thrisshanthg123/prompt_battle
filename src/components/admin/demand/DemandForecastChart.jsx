import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calendar, Sparkles, TrendingUp, Info } from 'lucide-react';

export default function DemandForecastChart({
  forecastData = [],
  horizon = '7d',
  onHorizonChange,
  dataSource = 'Member 4 AI Predictive Model',
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Historical vs Predicted Demand Forecast
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              95% Confidence Band
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multi-horizon time series comparison of recorded trips, current transit load, and forecasted student travel requirements.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
          {[
            { id: '1d', label: 'Next Day' },
            { id: '7d', label: 'Next 7 Days' },
            { id: '30d', label: 'Next 30 Days' },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => onHorizonChange && onHorizonChange(h.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                horizon === h.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Line Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={forecastData}
            margin={{ top: 15, right: 15, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey={horizon === '1d' ? 'time' : 'day'} tick={{ fontSize: 10, fill: '#475569' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '11px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="historical"
              name="Historical Demand"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Current Active Demand"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Predicted Future Demand"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#6366f1' }}
            />
            <Line
              type="monotone"
              dataKey="upper"
              name="Upper Bound (95% CI)"
              stroke="#cbd5e1"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Forecast generated using historical departure telemetry and rural university semester calendars.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Source: {dataSource}
        </span>
      </div>
    </div>
  );
}
