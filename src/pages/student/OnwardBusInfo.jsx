import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Clock, AlertTriangle, CheckCircle, Search, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function OnwardBusInfo() {
  const navigate = useNavigate();
  const { busSchedules, disruptions } = useMobility();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredBuses = busSchedules.filter((bus) => {
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'disrupted'
        ? bus.statusType === 'danger' || bus.statusType === 'warning'
        : bus.statusType === 'normal';

    const matchesSearch =
      bus.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.connectingStops.some((stop) => stop.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleRequestRideForBus = (bus) => {
    navigate('/request-journey');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Onward Bus Information</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Live Transit Feed
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time public bus timings, breakdown advisories, and instant community backup rides for student corridors.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Routes' },
            { id: 'disrupted', label: 'Disrupted / Delayed Only' },
            { id: 'normal', label: 'On Schedule' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Route 42, stop, destination..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Bus Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBuses.map((bus) => {
          const isDanger = bus.statusType === 'danger';
          const isWarning = bus.statusType === 'warning';

          return (
            <div
              key={bus.id}
              className={`rounded-2xl p-5 border transition space-y-4 bg-white ${
                isDanger
                  ? 'border-rose-300 shadow-rose-100/50 shadow-sm'
                  : isWarning
                  ? 'border-amber-300 shadow-amber-100/50 shadow-sm'
                  : 'border-slate-200/80 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Card Header: Route Number & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                      isDanger ? 'bg-rose-600' : isWarning ? 'bg-amber-600' : 'bg-blue-600'
                    }`}
                  >
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {bus.routeNumber}
                    </h3>
                    <p className="text-[11px] text-slate-500">{bus.operator}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isDanger
                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {bus.currentStatus}
                </span>
              </div>

              {/* Route Name */}
              <p className="text-xs font-semibold text-slate-800">{bus.name}</p>

              {/* Timing Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Departure</span>
                  <span className="font-bold text-slate-800">{bus.nextScheduledDeparture}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequency</span>
                  <span className="font-semibold text-slate-700">{bus.frequency}</span>
                </div>
              </div>

              {/* Connecting Stops */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Connecting Stops
                </p>
                <div className="flex flex-wrap gap-1">
                  {bus.connectingStops.map((stop, idx) => (
                    <span
                      key={stop}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                    >
                      {stop} {idx < bus.connectingStops.length - 1 ? '→' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Community Ride Assist */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Community Pool Ready
                </span>

                <button
                  onClick={() => handleRequestRideForBus(bus)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isDanger || isWarning
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{isDanger ? 'Request Breakdown Ride' : 'Book Shared Pool'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
