import React from 'react';
import { AlertTriangle, Car, ShieldAlert, Phone, RefreshCw, Clock } from 'lucide-react';

export default function DisruptionAlert({ journey, onRefresh }) {
  if (!journey) return null;

  const isBreakdown =
    journey.status === 'unallocated' ||
    journey.isReallocating ||
    journey.previousDriverName ||
    journey.reallocationStatus;

  if (!isBreakdown) return null;

  const hasNewVehicle = journey.matchedVehicle !== null && journey.matchedVehicle !== undefined;

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-2 border-rose-300 shadow-sm space-y-4">
      {/* Alert Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Disruption Protocol Activated
              </span>
              <span className="text-xs font-bold text-rose-700">
                {journey.reallocationStatus || 'Vehicle Breakdown'}
              </span>
            </div>
            <h3 className="text-base font-black text-rose-950 mt-0.5">
              Assigned Community Vehicle Experienced a Breakdown
            </h3>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              Your previous assigned vehicle (
              <strong>{journey.previousDriverName || 'Previous Driver'}</strong>) reported a mechanical failure. In accordance with SANCHAARI safety rules, the original allocation was isolated immediately to prevent stranded journeys.
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-rose-700 hover:bg-rose-100 transition shrink-0"
            title="Refresh allocation status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Reallocation Status Card */}
      <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-3">
        {hasNewVehicle ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Alternative Community Vehicle Reassigned</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✓ Reassigned Successfully
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">New Driver</span>
                <strong className="text-slate-900">{journey.matchedVehicle.driverName}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">New Vehicle Plate</span>
                <strong className="text-slate-900 font-mono">
                  {journey.matchedVehicle.vehicleNumber}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Updated ETA</span>
                <strong className="text-emerald-700">{journey.matchedVehicle.eta || '8 mins'}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Priority Reallocation in Progress</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Awaiting Alternative Vehicle
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby community auto and carpool drivers are currently being evaluated by Member 2’s matching engine. If fleet capacity along your corridor is exhausted, a government bus feeder link will be arranged.
            </p>
          </div>
        )}
      </div>

      {/* Emergency Helpline Contacts */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-rose-800 pt-1">
        <span>
          Campus Transit Helpline: <strong>+91 495 228 8000</strong>
        </span>
        <span className="text-[11px] font-medium text-slate-500">
          Zero double-booking guarantee active
        </span>
      </div>
    </div>
  );
}
