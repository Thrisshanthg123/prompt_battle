import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  Car,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Phone,
  Clock,
  X,
  RotateCcw,
} from 'lucide-react';

export default function ReallocationResults({ result, onDismiss, onRepairVehicle }) {
  if (!result) return null;

  const {
    brokenVehicle,
    beforeSnapshot,
    afterSnapshot,
    reallocatedRequests = [],
    unallocatedRequests = [],
    summary = {},
    disruptionRecord,
  } = result;

  const isFullReassignment = summary.studentsUnallocated === 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
      {/* Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Breakdown Audit Report
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Event #{result.disruptionRecord?.id || 'DIS-RECENT'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Intelligent Disruption & Reallocation Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Executed with Member 2's AI Matching Engine • Zero double-booking guarantee
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {brokenVehicle && onRepairVehicle && (
            <button
              onClick={() => onRepairVehicle(brokenVehicle.id)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              Resolve Breakdown & Repair
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Close Report"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Before and After Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              State Before Breakdown
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {beforeSnapshot?.previousStatus || 'Assigned'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Failed Vehicle:</span>
              <strong className="text-slate-800 font-mono">
                {beforeSnapshot?.vehicleNumber} ({beforeSnapshot?.driverName})
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Vehicle Type:</span>
              <span className="font-semibold text-slate-700">{beforeSnapshot?.vehicleType}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Assigned Students:</span>
              <strong className="text-slate-900">{beforeSnapshot?.affectedStudents} Passengers</strong>
            </div>
          </div>
        </div>

        {/* After Card */}
        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              State After Disruption Protocol
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
              Breakdown Isolated
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Failed Vehicle Status:</span>
              <strong className="text-rose-700 font-bold">Breakdown (0 Seats Available)</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Students Reallocated:</span>
              <strong className="text-emerald-700 font-bold">
                {summary.studentsReassigned} of {summary.affectedStudents} Successfully Reassigned
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Unallocated Students:</span>
              <strong
                className={
                  summary.studentsUnallocated > 0 ? 'text-rose-700 font-bold' : 'text-slate-600'
                }
              >
                {summary.studentsUnallocated} Students
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Affected Students</span>
          <span className="text-2xl font-black text-slate-800">{summary.affectedStudents}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <span className="text-[11px] text-emerald-700 font-semibold block">Reassigned</span>
          <span className="text-2xl font-black text-emerald-800">{summary.studentsReassigned}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
          <span className="text-[11px] text-rose-700 font-semibold block">Awaiting Vehicle</span>
          <span className="text-2xl font-black text-rose-800">{summary.studentsUnallocated}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
          <span className="text-[11px] text-blue-700 font-semibold block">Alternative Vehicles</span>
          <span className="text-2xl font-black text-blue-800">{summary.alternativeVehiclesUsedCount}</span>
        </div>
      </div>

      {/* Reallocated Students Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
          <span>Student Reassignment Audit</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Updated via Member 2 Matching Engine
          </span>
        </h3>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Route</th>
                <th className="py-2.5 px-4">New Status</th>
                <th className="py-2.5 px-4">Assigned Alternative Vehicle</th>
                <th className="py-2.5 px-4">ETA / Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reallocatedRequests.map((req) => {
                const isMatched = req.status === 'matched';

                return (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{req.studentName}</strong>
                      <span className="text-[10px] text-slate-400">{req.id}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {req.pickupLocation} → {req.destinationLocation}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isMatched
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isMatched ? '✓ Successfully Reassigned' : '⚠ No Suitable Vehicle Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {req.matchedVehicle ? (
                        <div>
                          <span className="font-mono font-bold text-slate-900">
                            {req.matchedVehicle.vehicleNumber}
                          </span>
                          <p className="text-[10px] text-slate-500">
                            {req.matchedVehicle.driverName} ({req.matchedVehicle.vehicleType})
                          </p>
                        </div>
                      ) : (
                        <span className="text-rose-600 font-bold text-[11px]">
                          Awaiting Alternative Vehicle
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {req.matchedVehicle ? (
                        <div>
                          <strong className="text-emerald-700 block">
                            {req.matchedVehicle.eta || 'En Route'}
                          </strong>
                          <span className="text-slate-400">{req.matchedVehicle.driverPhone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Queue Position #1</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alternative Vehicles Capacity Table (if any) */}
      {result.afterSnapshot?.alternativeVehiclesUsed?.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
          <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-4 h-4 text-blue-600" />
            <span>Alternative Vehicles Selected for Absorption</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.afterSnapshot.alternativeVehiclesUsed.map((veh) => (
              <div
                key={veh.id}
                className="p-3 rounded-xl bg-white border border-blue-200/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900">{veh.driverName}</strong>
                  <span className="font-mono text-[11px] text-blue-700 font-bold">
                    {veh.vehicleNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{veh.vehicleType}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Remaining Available Seats: {veh.remainingSeats}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
