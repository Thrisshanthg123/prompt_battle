import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Clock, AlertTriangle, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function PeakTravelChart({ peakData = [] }) {
  // Identify the busiest period dynamically
  const busiestPeriod = [...peakData].sort(
    (a, b) => (b.predictedDemand || 0) - (a.predictedDemand || 0)
  )[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Peak Travel Demand Prediction
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Hourly Surge Curve
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning projection of student departures by time interval compared against verified fleet capacity.
          </p>
        </div>

        {/* Legend Provenance Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Historical Recorded</span>
          <span className="text-slate-300">|</span>
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <strong className="text-purple-700">AI ML Forecast</strong>
        </div>
      </div>

      {/* Busiest Peak Travel Period Alert Card */}
      {busiestPeriod && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Predicted Busiest Travel Window
                </strong>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                  Critical Surge
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-rose-900 mt-0.5">
                {busiestPeriod.period}
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                Expected Demand: <strong>{busiestPeriod.predictedDemand} Students</strong> • Available Fleet Capacity:{' '}
                <strong>{busiestPeriod.availableCapacity} Seats</strong> • Projected Deficit:{' '}
                <strong className="text-rose-900 underline font-bold">
                  {busiestPeriod.predictedDemand - busiestPeriod.availableCapacity} Unallocated Passengers
                </strong>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] text-rose-700 block font-semibold">Deficit Severity</span>
            <span className="text-2xl font-black text-rose-700">
              +{Math.round(((busiestPeriod.predictedDemand - busiestPeriod.availableCapacity) / busiestPeriod.availableCapacity) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Recharts Area / Line Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={peakData} margin={{ top: 15, right: 15, left: -10, bottom: 10 }}>
            <defs>
              <linearGradient id="predictedDemandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fleetCapacityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="timeSlot" tick={{ fontSize: 10, fill: '#475569' }} />
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
            <Area
              type="monotone"
              dataKey="predictedDemand"
              name="Predicted Demand (AI ML)"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#predictedDemandGrad)"
            />
            <Area
              type="monotone"
              dataKey="availableCapacity"
              name="Available Vehicle Seats"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fleetCapacityGrad)"
            />
            <Line
              type="monotone"
              dataKey="historicalDemand"
              name="Historical Actual Demand"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interval Deficit Badges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-slate-100">
        {peakData.map((item) => {
          const deficit = Math.max(0, (item.predictedDemand || 0) - (item.availableCapacity || 0));
          return (
            <div
              key={item.timeSlot}
              className={`p-2 rounded-xl border text-center text-xs space-y-0.5 ${
                deficit > 0 ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-500 block truncate">
                {item.timeSlot}
              </span>
              <strong
                className={`text-xs block ${deficit > 0 ? 'text-rose-700' : 'text-slate-800'}`}
              >
                {item.predictedDemand} Pax
              </strong>
              <span
                className={`text-[9px] font-bold block ${
                  deficit > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {deficit > 0 ? `-${deficit} deficit` : 'Balanced'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
