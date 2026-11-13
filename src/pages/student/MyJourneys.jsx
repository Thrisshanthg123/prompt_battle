import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Route, MapPin, Calendar, Users, ArrowRight, XCircle, Search, Filter } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate, getUrgencyBadge } from '../../utils/formatters';

export default function MyJourneys() {
  const { journeys, cancelJourney } = useMobility();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJourneys = journeys.filter((journey) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? journey.status === 'in-progress' || journey.status === 'matched' || journey.status === 'requested'
        : journey.status === filterStatus;

    const matchesSearch =
      journey.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Journeys</span>
            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {journeys.length} Total
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your community mobility trips, requested backups, and history.
          </p>
        </div>

        <Link
          to="/request-journey"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
        >
          <span>New Request</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Trips' },
            { id: 'active', label: 'Active / Pending' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stops, routes, IDs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Journey Cards List */}
      <div className="space-y-4">
        {filteredJourneys.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Route className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No journeys found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no journeys matching your current filter criteria. Request a community ride whenever you experience transit disruptions.
            </p>
            <Link
              to="/request-journey"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Request a Ride
            </Link>
          </div>
        ) : (
          filteredJourneys.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition space-y-4"
            >
              {/* Card Top: ID, Status, Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {j.id}
                  </span>
                  <StatusBadge status={j.status} />
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getUrgencyBadge(j.urgency)}`}>
                    {j.urgency} Urgency
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(j.scheduledTime)}</span>
                </div>
              </div>

              {/* Card Body: Route Path & Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase">From</p>
                      <p className="text-sm font-bold text-slate-800">{j.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase">To</p>
                      <p className="text-sm font-bold text-slate-800">{j.destinationLocation}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <strong className="text-slate-700">Reason:</strong> {j.reason}
                    </span>
                    <span>
                      <strong className="text-slate-700">Passengers:</strong> {j.passengers}
                    </span>
                    <span>
                      <strong className="text-slate-700">Fare:</strong> {j.fareShare}
                    </span>
                  </div>
                </div>

                {/* Driver / Status Box */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex flex-col justify-between">
                  {j.matchedVehicle ? (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Assigned Driver
                      </span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{j.matchedVehicle.driverName}</p>
                      <p className="text-xs text-slate-500">{j.matchedVehicle.vehicleType}</p>
                      <p className="text-xs font-mono text-slate-700">{j.matchedVehicle.vehicleNumber}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        {j.status === 'cancelled' ? 'Trip Cancelled' : 'Awaiting Driver Match'}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {j.status === 'cancelled'
                          ? j.cancelReason || 'Cancelled by user'
                          : 'Matching with verified campus carpools & autos...'}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <Link
                      to={`/tracking/${j.id}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>Tracking & Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {j.status !== 'completed' && j.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelJourney(j.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
