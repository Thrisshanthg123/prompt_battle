import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AlertCircle, Database } from 'lucide-react';

export default function DemandCharts({
  villageData = [],
  peakPeriodData = [],
  forecastData = [],
  routeCapacityData = [],
  isSynthetic = true,
  source = 'Synthetic Demo Dataset (Member 4 Backend API Offline)',
}) {
  return (
    <div className="space-y-6">
      {/* API Source Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Database className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Data Stream:</strong> {source}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
            isSynthetic ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isSynthetic ? 'Demo Mode (Offline Contract)' : 'Live API Connected'}
        </span>
      </div>

      {/* Grid: 2 Charts Top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Village Demand Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Village-wise Transport Demand vs Vehicle Capacity
            </h3>
            <p className="text-xs text-slate-500">
              Current requests, predicted peak demand, and active fleet capacity by rural hub
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={villageData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="village"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="currentRequests" name="Current Requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vehicleCapacity" name="Fleet Capacity" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Peak Travel Periods Area Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Peak Travel Periods & Capacity Thresholds
            </h3>
            <p className="text-xs text-slate-500">
              Hourly student passenger demand curve against available community seats
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakPeriodData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Area
                  type="monotone"
                  dataKey="studentDemand"
                  name="Student Demand (Pax)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#demandGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="vehicleCapacity"
                  name="Vehicle Fleet Capacity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#capacityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: 2 Charts Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Historical vs Predicted Demand Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Historical vs Predicted Weekly Demand Trend
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis of recorded transit requests vs AI model projections
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Line
                  type="monotone"
                  dataKey="historical"
                  name="Historical Trips"
                  stroke="#64748b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecasted Demand"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 5, fill: '#8b5cf6' }}
                />
                <Line
                  type="monotone"
                  dataKey="confidenceUpper"
                  name="Upper Bound (95%)"
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Route Capacity Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Route Capacity vs Peak Transit Deficit
            </h3>
            <p className="text-xs text-slate-500">
              Critical transportation corridors requiring supplemental community autos or vans
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={routeCapacityData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="route"
                  tick={{ fontSize: 9, fill: '#334155' }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="seatCapacity" name="Fleet Seat Capacity" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="peakDemand" name="Peak Demand" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
