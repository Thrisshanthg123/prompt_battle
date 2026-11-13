import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Calendar,
  Clock,
  Users,
  Car,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { formatDate, getUrgencyBadge } from '../../utils/formatters';

export default function JourneyCard({ journey, onCancel }) {
  const isBreakdownOrUnallocated = journey.status === 'unallocated';
  const hasDriver = journey.matchedVehicle !== null && journey.matchedVehicle !== undefined;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs hover:shadow-md space-y-4 ${
        isBreakdownOrUnallocated
          ? 'border-rose-300 bg-rose-50/20'
          : journey.status === 'in-progress'
          ? 'border-emerald-400 ring-1 ring-emerald-400/30'
          : 'border-slate-200/90'
      }`}
    >
      {/* Header Strip: ID, Date, Urgency, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {journey.id}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {formatDate(journey.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getUrgencyBadge(journey.urgency)}`}>
            {journey.urgency} Urgency
          </span>
          <StatusBadge status={journey.status} />
        </div>
      </div>

      {/* Origin -> Destination Corridor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Pickup Point</span>
          </span>
          <p className="font-bold text-slate-800 text-sm">{journey.pickupLocation}</p>
          <p className="text-[11px] text-slate-500">Village: {journey.village || 'Rural Hub'}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Destination</span>
          </span>
          <p className="font-bold text-slate-800 text-sm">{journey.destinationLocation}</p>
          <p className="text-[11px] text-slate-500">
            Junction: {journey.preferredJunction || 'Nearest Hub'}
          </p>
        </div>
      </div>

      {/* Meta Specs: Time, Pax, Fare Share */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Arrival Required: <strong>{journey.scheduledTime}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Passengers: <strong>{journey.passengers || 1} Pax</strong></span>
        </div>

        <div className="text-[11px] font-semibold text-emerald-800">
          {journey.fareShare || 'Subsidized Community Pool'}
        </div>
      </div>

      {/* Assigned Vehicle or Breakdown Notice Strip */}
      {isBreakdownOrUnallocated ? (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Vehicle Breakdown Alert / Awaiting Alternative</strong>
            <p className="text-[11px] text-rose-800 mt-0.5">
              The original vehicle suffered a mechanical breakdown. The AI matching coordinator is reassigning you to an alternative verified driver.
            </p>
          </div>
        </div>
      ) : hasDriver ? (
        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-slate-900">{journey.matchedVehicle.driverName}</strong>
                <span className="font-mono text-[10px] font-bold bg-white px-1.5 py-0.2 rounded border border-emerald-200 text-slate-700">
                  {journey.matchedVehicle.vehicleNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {journey.matchedVehicle.vehicleType} • ETA: <strong className="text-emerald-700">{journey.matchedVehicle.eta || 'Active'}</strong>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>AI Matching Engine scanning nearby community autos & carpools...</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 flex items-center justify-between">
        {journey.status === 'requested' && onCancel && (
          <button
            onClick={() => onCancel(journey.id)}
            className="text-xs text-slate-400 hover:text-rose-600 font-semibold transition"
          >
            Cancel Request
          </button>
        )}

        <div className="ml-auto">
          <Link
            to={`/student/journeys/${journey.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
          >
            <span>View Journey Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
