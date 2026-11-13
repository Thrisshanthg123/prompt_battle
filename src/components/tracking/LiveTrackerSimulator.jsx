import React from 'react';
import { Play, CheckCheck, AlertOctagon, PhoneCall, RefreshCw } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function LiveTrackerSimulator({ journey }) {
  const { updateJourneyStatus, triggerSosAlert, cancelJourney } = useMobility();

  if (!journey) return null;

  const currentStatus = journey.status;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white border border-indigo-800/40 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-indigo-900/60">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Interactive Journey Controller
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Trip Simulation & Safety Controls
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {journey.matchedVehicle && (
            <a
              href={`tel:${journey.matchedVehicle.driverPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call Driver ({journey.matchedVehicle.driverName})
            </a>
          )}
          <button
            onClick={() => triggerSosAlert(journey.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition shadow animate-pulse"
          >
            <AlertOctagon className="w-3.5 h-3.5" /> EMERGENCY SOS
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-indigo-200">
          <p className="font-medium">Hackathon Demo Controls:</p>
          <p className="text-indigo-400">Simulate real-time status transitions for testing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentStatus === 'requested' && (
            <button
              onClick={() => updateJourneyStatus(journey.id, 'matched')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <Play className="w-3.5 h-3.5" /> Simulate Match Found
            </button>
          )}

          {currentStatus === 'matched' && (
            <button
              onClick={() => updateJourneyStatus(journey.id, 'in-progress')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <Play className="w-3.5 h-3.5" /> Start Journey (En Route)
            </button>
          )}

          {currentStatus === 'in-progress' && (
            <button
              onClick={() => updateJourneyStatus(journey.id, 'completed')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Complete Journey
            </button>
          )}

          {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
            <button
              onClick={() => cancelJourney(journey.id, 'Cancelled via interactive test panel')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
            >
              Cancel Request
            </button>
          )}

          {currentStatus === 'completed' && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Journey Safely Concluded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
