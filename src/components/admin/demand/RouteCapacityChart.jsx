import React from 'react';
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
import { AlertTriangle, ShieldCheck, Download, AlertOctagon, Car } from 'lucide-react';
import { getRouteStatusBadge, calculateSeatUtilization } from '../../../utils/demandHelpers';
import { exportToCSV } from '../../../utils/adminHelpers';

export default function RouteCapacityChart({ routesData = [] }) {
  const handleExport = () => {
    const rows = routesData.map((r) => ({
      Route: r.route,
      'Student Demand': r.studentDemand,
      'Available Legal Seats': r.availableSeats,
      'Allocated Students': r.allocatedStudents,
      'Unallocated Students': r.unallocatedStudents,
      'Capacity Shortage': r.capacityShortage,
      'Seat Utilization (%)': `${r.seatUtilization}%`,
      'Recurring Shortage': r.recurringShortage ? 'Yes' : 'No',
    }));
    exportToCSV(rows, `sanchaari_route_capacities_${Date.now()}.csv`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Route Demand vs Vehicle Capacity
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Legal Fleet
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating passenger demand against verified, legally eligible vehicle seats across active campus transit corridors.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Routes CSV</span>
        </button>
      </div>

      {/* Horizontal Bar Chart: Seat Capacity vs Student Demand */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={routesData}
            layout="vertical"
            margin={{ top: 10, right: 25, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis
              type="category"
              dataKey="route"
              tick={{ fontSize: 9, fill: '#334155' }}
              width={160}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '11px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
            <Bar
              dataKey="availableSeats"
              name="Verified Legal Seats"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="studentDemand"
              name="Total Student Demand"
              fill="#f43f5e"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Routes Table with Specifications */}
      <div className="overflow-x-auto border border-slate-200/90 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Transit Route Corridor</th>
              <th className="py-3 px-4 text-center">Student Demand</th>
              <th className="py-3 px-4 text-center">Available Seats</th>
              <th className="py-3 px-4 text-center">Allocated</th>
              <th className="py-3 px-4 text-center">Unallocated</th>
              <th className="py-3 px-4 text-center">Capacity Shortage</th>
              <th className="py-3 px-4 text-center">Seat Utilization</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routesData.map((r) => {
              const statusBadge = getRouteStatusBadge(r.status, r.capacityShortage);
              const isShortage = r.capacityShortage > 0;

              return (
                <tr
                  key={r.id || r.route}
                  className={`hover:bg-slate-50/80 transition ${
                    isShortage ? 'bg-rose-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-slate-900">{r.route}</strong>
                      {r.recurringShortage && (
                        <span
                          className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-black uppercase shrink-0"
                          title="Recurring Shortage Corridor"
                        >
                          Recurring
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {r.verifiedVehiclesCount || 6} verified vehicles assigned
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {r.studentDemand}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                    {r.availableSeats}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                    {r.allocatedStudents}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        r.unallocatedStudents > 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.unallocatedStudents}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {r.capacityShortage > 0 ? (
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
                        -{r.capacityShortage} seats
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 text-[11px]">0 deficit</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700">
                      <span>{r.seatUtilization}%</span>
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            r.seatUtilization >= 95 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${r.seatUtilization}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
