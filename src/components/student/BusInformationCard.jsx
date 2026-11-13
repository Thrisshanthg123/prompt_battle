import React from 'react';
import { Bus, Clock, MapPin, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * BusInformationCard
 * Visual representation of an onward government bus connection.
 * Shows seamless multi-modal transit pipeline:
 * Student Village -> Community Vehicle -> Major Bus Junction -> Govt Bus -> Destination College
 */
export default function BusInformationCard({ bus, onBookBackup }) {
  const isDanger = bus.statusType === 'danger' || bus.status === 'Cancelled' || bus.status === 'Breakdown';
  const isDelayed = bus.statusType === 'warning' || (bus.delay && bus.delay.includes('mins'));
  const isNormal = !isDanger && !isDelayed;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 bg-white relative overflow-hidden ${
        isDanger
          ? 'border-rose-300 ring-1 ring-rose-200 shadow-sm'
          : isDelayed
          ? 'border-amber-300 ring-1 ring-amber-200 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Banner for Disruptions */}
      {isDanger && (
        <div className="bg-rose-50 border-b border-rose-100 -mx-5 -mt-5 px-5 py-2 mb-4 flex items-center justify-between text-xs text-rose-800 font-semibold">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Service Disrupted: Community Dispatch Priority Active</span>
          </div>
          <span className="text-[10px] bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded-full font-bold uppercase">
            Disrupted
          </span>
        </div>
      )}

      {/* Main Bus Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${
              isDanger
                ? 'bg-rose-600'
                : isDelayed
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
          >
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900">
                {bus.routeNumber}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isDanger
                    ? 'bg-rose-100 text-rose-800'
                    : isDelayed
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {bus.status || (isDanger ? 'Disrupted' : isDelayed ? 'Delayed' : 'On Schedule')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{bus.name || bus.routeName}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-slate-800 font-bold text-sm justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{bus.departureTime || bus.scheduledDeparture || '07:45 AM'}</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
            {bus.delay ? (
              <span className="text-amber-700 font-bold">Delay: {bus.delay}</span>
            ) : (
              <span className="text-emerald-700 font-bold">On Time</span>
            )}
          </p>
        </div>
      </div>

      {/* Junction & Platform Details */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Junction / Bay
          </span>
          <span className="font-semibold text-slate-800">
            {bus.junction || bus.busJunction || 'Hubli Central Stand'} (Bay #{bus.bayNumber || bus.platform || '4'})
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Destination College
          </span>
          <span className="font-semibold text-slate-800 truncate block">
            {bus.destination || bus.destinationStop || 'BVB Engg College'}
          </span>
        </div>
      </div>

      {/* Multi-modal Pipeline Visualizer */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Coordinated Student Transit Link
        </p>
        <div className="flex items-center text-[11px] text-slate-600 font-medium overflow-x-auto pb-1 gap-1.5">
          <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 shrink-0">
            Rural Pickup
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold shrink-0">
            Community Auto/Van
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold shrink-0">
            {bus.junction || 'Major Junction'}
          </span>
          <span className="text-slate-400">→</span>
          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold shrink-0">
            Govt Bus {bus.routeNumber}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500">
          {bus.frequency ? `Frequency: ${bus.frequency}` : 'Scheduled morning service'}
        </div>

        {onBookBackup ? (
          <button
            onClick={() => onBookBackup(bus)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <span>Request Junction Ride</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <Link
            to="/student/request"
            state={{
              preferredJunction: bus.junction || 'Hubli Central Stand',
              destination: bus.destination || 'BVB Engg College',
              busNumber: bus.routeNumber,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <span>Request Junction Ride</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
