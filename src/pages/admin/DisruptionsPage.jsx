import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Users,
  CheckCircle2,
  Car,
  Plus,
  ArrowRight,
  AlertOctagon,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  Wrench,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import AdminStatCard from '../../components/admin/AdminStatCard';
import DisruptionModal from '../../components/admin/DisruptionModal';
import ReallocationResults from '../../components/admin/ReallocationResults';

export default function DisruptionsPage() {
  const {
    disruptions,
    logDisruption,
    resolveDisruption,
    vehicles,
    journeys,
    simulateBreakdown,
    repairVehicle,
    lastDisruptionResult,
    setLastDisruptionResult,
  } = useMobility();

  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

  // Broadcast Disruption Form State
  const [form, setForm] = useState({
    routeNumber: 'Route 42',
    routeName: 'Kozhikode City to REC / NIT Calicut & GECK',
    affectedSegment: 'Mavoor Road Junction',
    type: 'Mechanical Breakdown',
    severity: 'High',
    impactedStudents: 25,
    advice: 'Community autos dispatched to Mavoor Hub. Stranded students requested to board pooled rides via Student Portal.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');
  const brokenVehicles = vehicles.filter((v) => v.status === 'breakdown');

  // Dynamic Disruption Metrics
  const totalStudentsAffected = disruptions.reduce(
    (sum, d) => sum + Number(d.impactedStudents || 0),
    0
  );
  const studentsReassignedCount = disruptions.reduce(
    (sum, d) => sum + Number(d.reassignedStudents || (d.communityDispatched ? d.impactedStudents : 0)),
    0
  );
  const studentsWaitingCount = journeys
    .filter((r) => r.status === 'unallocated')
    .reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const alternativeVehiclesCount = vehicles.filter(
    (v) => v.status === 'available' && v.verified && (v.availableSeats || 0) > 0
  ).length;

  const handleSubmitBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await logDisruption({
      routeNumber: form.routeNumber,
      routeName: form.routeName,
      affectedSegment: form.affectedSegment,
      type: form.type,
      severity: form.severity,
      impactedStudents: Number(form.impactedStudents || 15),
      advice: form.advice,
      communityDispatched: true,
    });
    setIsSubmitting(false);
  };

  const handleConfirmBreakdown = async (vehicleId, options) => {
    return await simulateBreakdown(vehicleId, options);
  };

  return (
    <div className="space-y-6">
      {/* Header & Prominent Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <span>Intelligent Disruption Response Unit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Transit Disruption & Vehicle Breakdown Engine
          </h1>
          <p className="mt-2 text-rose-100 text-xs sm:text-sm leading-relaxed">
            Ensure no student is stranded when community vehicles or public buses fail. The system automatically releases compromised allocations and reassigns passengers using Member 2's AI matching engine.
          </p>
        </div>

        <button
          onClick={() => setIsBreakdownModalOpen(true)}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-800 font-extrabold text-sm shadow-xl hover:scale-102 transition shrink-0"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
          <span>Simulate Vehicle Breakdown</span>
        </button>
      </div>

      {/* Disruption KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <AdminStatCard
          title="Active Disruptions"
          value={activeDisruptions.length}
          subtitle={`${brokenVehicles.length} vehicle breakdowns`}
          icon={ShieldAlert}
          color="rose"
        />

        <AdminStatCard
          title="Students Affected"
          value={totalStudentsAffected}
          subtitle="Cumulative passengers"
          icon={Users}
          color="purple"
        />

        <AdminStatCard
          title="Reassigned Students"
          value={studentsReassignedCount}
          subtitle="Via AI Matching Engine"
          icon={CheckCircle2}
          color="emerald"
        />

        <AdminStatCard
          title="Still Waiting"
          value={studentsWaitingCount}
          subtitle="Unallocated queue"
          icon={AlertOctagon}
          color={studentsWaitingCount > 0 ? 'rose' : 'emerald'}
        />

        <AdminStatCard
          title="Alternative Units"
          value={alternativeVehiclesCount}
          subtitle="Verified standby fleet"
          icon={Car}
          color="blue"
        />
      </div>

      {/* Active Before-and-After Disruption Reallocation Audit Report */}
      {lastDisruptionResult && (
        <ReallocationResults
          result={lastDisruptionResult}
          onDismiss={() => setLastDisruptionResult(null)}
          onRepairVehicle={repairVehicle}
        />
      )}

      {/* Two Column Grid: Broadcast Form & Active Corridor Disruptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disruption Broadcast Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-600" />
              <span>Broadcast Public Transit Alert</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Student sync</span>
          </div>

          <form onSubmit={handleSubmitBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Impacted Route Number</label>
              <input
                type="text"
                required
                value={form.routeNumber}
                onChange={(e) => setForm({ ...form, routeNumber: e.target.value })}
                placeholder="e.g. Route 42, Route 108"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Route Corridor</label>
              <input
                type="text"
                required
                value={form.routeName}
                onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Affected Location / Segment</label>
              <input
                type="text"
                required
                value={form.affectedSegment}
                onChange={(e) => setForm({ ...form, affectedSegment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Disruption Cause</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="Mechanical Breakdown">Mechanical Breakdown</option>
                  <option value="Road Maintenance">Road Maintenance</option>
                  <option value="Weather / Tree Fall">Weather / Tree Fall</option>
                  <option value="Frequency Gap">Frequency Gap</option>
                  <option value="Strike / Driver Absence">Strike / Driver Absence</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Impacted Students</label>
              <input
                type="number"
                min="1"
                value={form.impactedStudents}
                onChange={(e) => setForm({ ...form, impactedStudents: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Travel Advisory</label>
              <textarea
                rows="2"
                required
                value={form.advice}
                onChange={(e) => setForm({ ...form, advice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs"
            >
              {isSubmitting ? 'Broadcasting Alert...' : 'Broadcast Alert to All Portals'}
            </button>
          </form>
        </div>

        {/* Active Disruptions Corridor List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Transit Disruptions ({disruptions.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-synced to Student Emergency Feed
            </span>
          </div>

          <div className="space-y-3">
            {disruptions.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md font-mono">
                      {d.routeNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{d.routeName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === 'Active'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Segment:</strong> {d.affectedSegment} • <strong>Cause:</strong> {d.type}
                  </p>
                  <p className="text-[11px] text-slate-500">{d.advice}</p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                    <span>Reported: {d.reportedAt}</span>
                    <span>•</span>
                    <span>Students Impacted: {d.impactedStudents}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {d.status === 'Active' && (
                    <button
                      onClick={() => resolveDisruption(d.id)}
                      className="text-xs px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Simulation Modal */}
      <DisruptionModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        vehicles={vehicles}
        requests={journeys}
        onConfirmBreakdown={handleConfirmBreakdown}
      />
    </div>
  );
}
