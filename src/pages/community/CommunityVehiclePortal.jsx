import React from 'react';
import { Car, ShieldCheck, UserCheck, Code, CheckCircle, Clock } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function CommunityVehiclePortal() {
  const { vehicles, journeys, setVehicles } = useMobility();

  const toggleStatus = (id) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: v.status === 'available' ? 'on-trip' : 'available' } : v
      )
    );
  };

  const pendingRequests = journeys.filter((j) => j.status === 'requested');

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
          <span>Assigned to Member 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Community Vehicle Portal & AI Matching Engine
        </h1>
        <p className="mt-2 text-amber-100 text-sm max-w-2xl">
          This portal allows registered community auto drivers, college vans, and carpools to accept stranded student requests and coordinates AI-driven route matching.
        </p>
      </div>

      {/* Integration Guide Box for Member 2 */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/90 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Code className="w-4 h-4 text-amber-600" />
          <span>Integration Contract for Member 2</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          The shared application state connects your vehicle list to the Student Portal. Your AI Matching Engine interface is located at:
          <code className="mx-1 px-2 py-0.5 rounded bg-amber-200/60 font-mono text-amber-900 font-bold">
            src/services/matchingEngineInterface.js
          </code>
          When a student submits a request, <code className="font-mono">findBestVehicleMatch(request, vehicles)</code> is invoked automatically.
        </p>
      </div>

      {/* Two Column Layout: Vehicles Fleet & Pending Match Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Fleet */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Registered Community Fleet ({vehicles.length})
            </h2>
            <span className="text-xs text-slate-500">Shared state connected</span>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{v.driverName}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ★ {v.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {v.vehicleType} • <span className="font-mono font-semibold">{v.vehicleNumber}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Base: {v.baseLocation} • Capacity: {v.capacity} seats ({v.availableSeats} available)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      v.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {v.status === 'available' ? 'Available' : 'On Active Trip'}
                  </span>
                  <button
                    onClick={() => toggleStatus(v.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Student Requests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Pending Student Requests ({pendingRequests.length})
          </h2>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                All student requests have been matched or fulfilled!
              </p>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
                      {req.urgency}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{req.pickupLocation} → {req.destinationLocation}</p>
                  <p className="text-[11px] text-slate-600">{req.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
