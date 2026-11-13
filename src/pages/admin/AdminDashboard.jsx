import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Car,
  Compass,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Bus,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import { calculateDashboardKPIs } from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';
import ActivityTimeline from '../../components/admin/ActivityTimeline';
import ReallocationResults from '../../components/admin/ReallocationResults';
import { getRequestStatusBadge, getVehicleStatusBadge } from '../../utils/adminHelpers';

export default function AdminDashboard() {
  const {
    journeys,
    vehicles,
    disruptions,
    allocations,
    resolveDisruption,
    lastDisruptionResult,
    setLastDisruptionResult,
    repairVehicle,
  } = useMobility();

  const outletCtx = useOutletContext();
  const openBreakdownModal = outletCtx?.openBreakdownModal;

  // Dynamic KPI calculation (strictly calculated from live shared state)
  const kpis = calculateDashboardKPIs({
    requests: journeys,
    vehicles,
    disruptions,
    allocations,
  });

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');
  const brokenVehicles = vehicles.filter((v) => v.status === 'breakdown');

  // Transportation Status Breakdown
  const availableVehiclesCount = vehicles.filter(
    (v) => v.status === 'available' && v.verified !== false && (v.availableSeats || 0) > 0
  ).length;
  const assignedVehiclesCount = vehicles.filter(
    (v) => v.status === 'on-trip' || (v.status === 'available' && v.availableSeats < v.capacity)
  ).length;
  const breakdownVehiclesCount = vehicles.filter((v) => v.status === 'breakdown').length;

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Disruption Alert Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Kozhikode Rural Mobility Operations Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SANCHAARI Command & Coordination Hub
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            "When the bus stops, the journey doesn't." Real-time monitoring of rural student transit requests, community carpools, KSRTC bus corridors, and automated disruption mitigation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {openBreakdownModal && (
              <button
                onClick={openBreakdownModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition hover:scale-102"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Vehicle Breakdown</span>
              </button>
            )}

            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              <Users className="w-4 h-4" />
              <span>Review {kpis.totalRequests} Student Requests</span>
            </Link>

            <Link
              to="/admin/demand"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 font-semibold text-xs border border-indigo-400/30 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Demand Forecasting</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Disruption Alert Bar (if active) */}
      {activeDisruptions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-bounce">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-rose-950">
                  Critical Transit Disruption Active: {activeDisruptions[0].routeNumber}
                </strong>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                  {activeDisruptions[0].severity} Severity
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                {activeDisruptions[0].affectedSegment} • {activeDisruptions[0].advice}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <Link
              to="/admin/disruptions"
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
            >
              Manage Disruption
            </Link>
            <button
              onClick={() => resolveDisruption(activeDisruptions[0].id)}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold text-xs transition"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      )}

      {/* Recent Disruption Audit Report (if one was just simulated) */}
      {lastDisruptionResult && (
        <ReallocationResults
          result={lastDisruptionResult}
          onDismiss={() => setLastDisruptionResult(null)}
          onRepairVehicle={repairVehicle}
        />
      )}

      {/* Section 1: Dynamic KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Core Mobility KPI Metrics
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live calculation from state</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <AdminStatCard
            title="Total Requests"
            value={kpis.totalRequests}
            subtitle={`${kpis.pendingRequests} pending`}
            icon={Users}
            color="blue"
            trend="+14% vs yesterday"
          />

          <AdminStatCard
            title="Active Allocations"
            value={kpis.activeAllocations}
            subtitle={`${kpis.allocationRate}% match rate`}
            icon={CheckCircle}
            color="emerald"
            badgeText="Optimal"
          />

          <AdminStatCard
            title="Available Fleet"
            value={kpis.availableVehicles}
            subtitle={`of ${kpis.totalRegisteredVehicles} registered`}
            icon={Car}
            color="indigo"
          />

          <AdminStatCard
            title="Travelling Pax"
            value={kpis.studentsTravelling}
            subtitle="Students en route"
            icon={Compass}
            color="purple"
          />

          <AdminStatCard
            title="Unallocated"
            value={kpis.unallocatedStudents}
            subtitle={kpis.unallocatedStudents > 0 ? 'Requires attention' : 'Zero stranded'}
            icon={AlertOctagon}
            color={kpis.unallocatedStudents > 0 ? 'rose' : 'emerald'}
            trend={kpis.unallocatedStudents > 0 ? 'Queue active' : 'Clear'}
            trendDirection={kpis.unallocatedStudents > 0 ? 'down' : 'up'}
          />

          <AdminStatCard
            title="Active Disruptions"
            value={kpis.activeDisruptions}
            subtitle={kpis.breakdownVehicles > 0 ? `${kpis.breakdownVehicles} fleet breakdown` : 'Corridor incidents'}
            icon={ShieldAlert}
            color={kpis.activeDisruptions > 0 ? 'rose' : 'blue'}
          />
        </div>
      </div>

      {/* Section 2: Transportation Overview & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transportation Overview Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              A. Transportation Overview
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Kozhikode Region
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Total Student Requests:</span>
              <strong className="text-slate-900 font-bold">{kpis.totalRequests}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Total Registered Vehicles:</span>
              <strong className="text-slate-900 font-bold">{kpis.totalRegisteredVehicles}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Total Successful Allocations:</span>
              <strong className="text-emerald-700 font-bold">{kpis.activeAllocations + kpis.completedJourneys}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Pending Requests:</span>
              <strong className="text-amber-700 font-bold">{kpis.pendingRequests}</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Unallocated Students:</span>
              <strong className={kpis.unallocatedStudents > 0 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                {kpis.unallocatedStudents}
              </strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600 font-medium">Completed Journeys:</span>
              <strong className="text-blue-700 font-bold">{kpis.completedJourneys}</strong>
            </div>
          </div>
        </div>

        {/* Transportation Status Indicators */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              C. Fleet & Operations Status
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live gauges</span>
          </div>

          <div className="space-y-4">
            {/* Status Item 1: Available Vehicles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Available Standby Vehicles</span>
                <strong className="text-emerald-700">{availableVehiclesCount} units</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (availableVehiclesCount / (vehicles.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Status Item 2: Vehicles on Active Trips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Vehicles on Active Trips</span>
                <strong className="text-blue-700">{assignedVehiclesCount} units</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (assignedVehiclesCount / (vehicles.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Status Item 3: Breakdown Vehicles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Vehicles Under Breakdown</span>
                <strong className="text-rose-700">{breakdownVehiclesCount} units</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (breakdownVehiclesCount / (vehicles.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Status Item 4: Pending Student Requests */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Pending Requests Pool</span>
                <strong className="text-amber-700">{kpis.pendingRequests} requests</strong>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (kpis.pendingRequests / (journeys.length || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              D. Quick Actions
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Direct navigation</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Link
              to="/admin/requests"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition text-xs font-bold text-slate-800 hover:text-blue-900 group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>View Student Requests</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/vehicles"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition text-xs font-bold text-slate-800 hover:text-blue-900 group"
            >
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-blue-600" />
                <span>View Community Fleet</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/disruptions"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-200 transition text-xs font-bold text-slate-800 hover:text-rose-900 group"
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Manage Disruptions</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/buses"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition text-xs font-bold text-slate-800 hover:text-blue-900 group"
            >
              <div className="flex items-center gap-2.5">
                <Bus className="w-4 h-4 text-blue-600" />
                <span>View Bus & Junction Info</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition text-xs font-bold text-slate-800 hover:text-indigo-900 group"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>View Analytics</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section 3: Recent Activity Timeline & Live Allocations Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              B. Recent System Activities
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live feed</span>
          </div>

          <ActivityTimeline maxItems={6} showFilters={false} />
        </div>

        {/* Live Active Allocations Overview Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Journey Allocations & In-Progress Trips
            </h3>
            <Link
              to="/admin/requests"
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              View Full Table ({journeys.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Assigned Vehicle</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journeys.slice(0, 5).map((req) => {
                  const badge = getRequestStatusBadge(req.status);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{req.id}</td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-800 block">{req.studentName}</strong>
                        <span className="text-[10px] text-slate-400">{req.village || 'Rural Hub'}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {req.pickupLocation} → {req.destinationLocation}
                      </td>
                      <td className="py-3 px-3">
                        {req.matchedVehicle ? (
                          <div>
                            <span className="font-mono font-bold text-slate-800">
                              {req.matchedVehicle.vehicleNumber}
                            </span>
                            <p className="text-[10px] text-slate-500">{req.matchedVehicle.driverName}</p>
                          </div>
                        ) : (
                          <span className="text-rose-600 font-semibold text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
