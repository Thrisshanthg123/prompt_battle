import React from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  AlertTriangle,
  Clock,
  Car,
  Compass,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils/formatters';

export default function StudentDashboard() {
  const { studentProfile, journeys, disruptions, vehicles } = useMobility();

  const activeJourneys = journeys.filter(
    (j) => j.status === 'in-progress' || j.status === 'matched' || j.status === 'requested'
  );

  const completedJourneys = journeys.filter((j) => j.status === 'completed');
  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');
  const availableVehicles = vehicles.filter((v) => v.status === 'available');

  const primaryActiveJourney = activeJourneys[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Hero */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/50 backdrop-blur-sm border border-emerald-400/30 text-xs font-semibold text-emerald-100 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Verified Student: {studentProfile.institution}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {studentProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            "When the bus stops, the journey doesn't." Need immediate first-mile backup or stranded due to a bus breakdown?
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/request-journey"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Request Community Ride</span>
            </Link>

            <Link
              to="/onward-bus"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/90 text-white font-semibold text-sm border border-emerald-500/40 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Check Bus Schedules</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Journeys"
          value={activeJourneys.length}
          subtitle={primaryActiveJourney ? '1 en route / matched' : 'No active trips'}
          icon={Car}
          color="blue"
        />
        <StatCard
          title="Active Disruptions"
          value={activeDisruptions.length}
          subtitle="Road & bus alerts"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Community Drivers"
          value={availableVehicles.length}
          subtitle="Online & ready"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Trips Completed"
          value={completedJourneys.length}
          subtitle="Safe student arrivals"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Active Journey Live Tracker Spotlight */}
      {primaryActiveJourney && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/30 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-slate-900">Active Journey in Progress</h2>
              <StatusBadge status={primaryActiveJourney.status} />
            </div>
            <Link
              to={`/tracking/${primaryActiveJourney.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Open Live Radar & Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Pickup Location</p>
                  <p className="text-sm font-bold text-slate-800">{primaryActiveJourney.pickupLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Destination</p>
                  <p className="text-sm font-bold text-slate-800">{primaryActiveJourney.destinationLocation}</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">Reason:</span> {primaryActiveJourney.reason} •{' '}
                <span className="font-semibold text-slate-700">Fare Share:</span> {primaryActiveJourney.fareShare}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
              {primaryActiveJourney.matchedVehicle ? (
                <div>
                  <p className="text-xs uppercase font-bold text-emerald-700">Matched Community Ride</p>
                  <p className="text-base font-extrabold text-slate-800 mt-1">
                    {primaryActiveJourney.matchedVehicle.driverName}
                  </p>
                  <p className="text-xs text-slate-600">
                    {primaryActiveJourney.matchedVehicle.vehicleType} ({primaryActiveJourney.matchedVehicle.vehicleNumber})
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-2">
                    ETA: {primaryActiveJourney.matchedVehicle.eta}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs uppercase font-bold text-amber-700">Awaiting Match</p>
                  <p className="text-xs text-slate-600 mt-1">
                    AI Coordinator is matching available autos & parent carpools.
                  </p>
                </div>
              )}

              <Link
                to={`/tracking/${primaryActiveJourney.id}`}
                className="mt-4 w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition"
              >
                Track Live GPS
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Transit Disruptions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Bus Disruptions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">Live Transit Disruptions</h3>
            </div>
            <Link to="/onward-bus" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Buses
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {activeDisruptions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active bus disruptions reported right now.</p>
            ) : (
              activeDisruptions.map((disruption) => (
                <div
                  key={disruption.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                      {disruption.routeNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      {disruption.type}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{disruption.routeName}</p>
                  <p className="text-[11px] text-slate-600">{disruption.advice}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-amber-200/70">
                    <span className="text-[10px] text-slate-500">Reported: {disruption.reportedAt}</span>
                    <Link
                      to="/request-journey"
                      state={{
                        busNumber: disruption.routeNumber,
                        pickupLocation: disruption.affectedSegment || 'Mavoor Road Bus Stand',
                        reason: `Public Bus Breakdown (${disruption.routeNumber})`,
                        notes: `Stranded at ${disruption.affectedSegment} due to ${disruption.type}. ${disruption.advice}`,
                        urgency: disruption.severity === 'High' ? 'High' : 'Medium',
                      }}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <span>Join Pool</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Journey Activity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-sm">Your Recent Journeys</h3>
            </div>
            <Link to="/my-journeys" className="text-xs font-semibold text-emerald-700 hover:underline">
              View History
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {journeys.slice(0, 3).map((j) => (
              <div
                key={j.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate">{j.pickupLocation}</span>
                    <span className="text-slate-400 text-xs">→</span>
                    <span className="text-xs font-bold text-slate-800 truncate">{j.destinationLocation}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{j.reason} • {formatDate(j.scheduledTime)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={j.status} />
                  <Link
                    to={`/tracking/${j.id}`}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
