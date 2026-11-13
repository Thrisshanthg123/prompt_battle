import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  AlertTriangle,
  MapPin,
  Users,
  CheckCircle2,
  AlertOctagon,
  Download,
  Info,
} from 'lucide-react';
import { getDemandClassificationBadge, filterVillages } from '../../../utils/demandHelpers';
import { exportToCSV } from '../../../utils/adminHelpers';

export default function VillageDemandChart({
  villages = [],
  selectedVillage = 'all',
  searchQuery = '',
}) {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  const filteredData = filterVillages(villages, selectedVillage, searchQuery);

  const handleExport = () => {
    const exportRows = filteredData.map((v) => ({
      'Village Name': v.village,
      'Total Requests': v.totalRequests,
      'Average Daily Demand': v.avgDailyDemand,
      'Allocated Students': v.allocatedStudents,
      'Unallocated Students': v.unallocatedStudents,
      'Vehicle Capacity': v.vehicleCapacity,
      'Demand Classification': v.classification,
      'Risk Assessment': v.riskFactor,
    }));
    exportToCSV(exportRows, `sanchaari_village_demand_${Date.now()}.csv`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Village Demand Analysis
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredData.length} Villages Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transportation volume, allocated seats, and stranded student queues across rural origin points.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'chart'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Chart
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Table
            </button>
          </div>

          <button
            onClick={handleExport}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
            title="Export Village Demand Data to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main View: Chart or Table */}
      {viewMode === 'chart' ? (
        <div className="space-y-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="village"
                  tick={{ fontSize: 10, fill: '#475569' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                <Bar
                  dataKey="totalRequests"
                  name="Total Student Requests"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgDailyDemand"
                  name="Avg Daily Demand"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="allocatedStudents"
                  name="Allocated Students"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="unallocatedStudents"
                  name="Unallocated (Stranded)"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 border border-slate-100">
            <span>
              💡 <strong>Tip:</strong> Click the "Data Table" view above to inspect risk assessments and demand classification badges.
            </span>
            <span className="text-rose-700 font-bold">
              Critical Shortage Hubs: {filteredData.filter((v) => v.classification === 'CRITICAL').length}
            </span>
          </div>
        </div>
      ) : (
        /* Data Table View */
        <div className="overflow-x-auto border border-slate-200/90 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Village Name</th>
                <th className="py-3 px-4 text-center">Total Requests</th>
                <th className="py-3 px-4 text-center">Avg Daily Demand</th>
                <th className="py-3 px-4 text-center">Allocated Pax</th>
                <th className="py-3 px-4 text-center">Unallocated Pax</th>
                <th className="py-3 px-4 text-center">Classification</th>
                <th className="py-3 px-4">Recurring Shortage & Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((v) => {
                const badge = getDemandClassificationBadge(v.classification);
                const isCritical = v.classification === 'CRITICAL';

                return (
                  <tr
                    key={v.village}
                    className={`hover:bg-slate-50/80 transition ${
                      isCritical ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{v.village}</strong>
                      <span className="text-[10px] text-slate-400">Rural Hub Corridor</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {v.totalRequests}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {v.avgDailyDemand}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {v.allocatedStudents}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          v.unallocatedStudents > 0
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {v.unallocatedStudents}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p
                        className={`text-[11px] leading-relaxed ${
                          isCritical ? 'text-rose-900 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {v.riskFactor}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
