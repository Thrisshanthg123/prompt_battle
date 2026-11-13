import React, { useState } from 'react';
import { ShieldAlert, Plus, CheckCircle, Code, Bus, AlertTriangle, Users } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function AdminDashboard() {
  const { disruptions, logDisruption, resolveDisruption, journeys, vehicles } = useMobility();

  const [form, setForm] = useState({
    routeNumber: 'Route 52',
    routeName: 'Kunnamangalam - REC Campus Shuttle',
    affectedSegment: 'Karanthur Junction',
    type: 'Mechanical Breakdown',
    severity: 'High',
    advice: 'Community autos dispatched to Karanthur. Stranded students requested to board pooled rides.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await logDisruption({
      routeNumber: form.routeNumber,
      routeName: form.routeName,
      affectedSegment: form.affectedSegment,
      type: form.type,
      severity: form.severity,
      advice: form.advice,
      impactedStudents: 15,
      communityDispatched: true,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
          <span>Assigned to Member 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Admin Dashboard & Disruption Management
        </h1>
        <p className="mt-2 text-purple-100 text-sm max-w-2xl">
          Broadcast public bus breakdowns, road maintenance delays, and coordinate community vehicle dispatching across campus transit routes.
        </p>
      </div>

      {/* Integration Guide Box for Member 3 */}
      <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200/90 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
          <Code className="w-4 h-4 text-purple-600" />
          <span>Integration Contract for Member 3</span>
        </div>
        <p className="text-purple-800 leading-relaxed">
          Disruptions logged here automatically trigger the top-level emergency notification banner on the Student Portal.
          Your disruption management interface is located at:
          <code className="mx-1 px-2 py-0.5 rounded bg-purple-200/60 font-mono text-purple-900 font-bold">
            src/services/disruptionEngineInterface.js
          </code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disruption Logging Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" />
            <span>Broadcast Transit Alert</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Route Number</label>
              <input
                type="text"
                required
                value={form.routeNumber}
                onChange={(e) => setForm({ ...form, routeNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Route Corridor</label>
              <input
                type="text"
                required
                value={form.routeName}
                onChange={(e) => setForm({ ...form, routeName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Affected Location / Segment</label>
              <input
                type="text"
                required
                value={form.affectedSegment}
                onChange={(e) => setForm({ ...form, affectedSegment: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Disruption Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-2 py-2 border rounded-lg bg-white"
                >
                  <option value="Mechanical Breakdown">Breakdown</option>
                  <option value="Road Maintenance">Roadwork</option>
                  <option value="Weather / Tree Fall">Weather</option>
                  <option value="Frequency Gap">Frequency Gap</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full px-2 py-2 border rounded-lg bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Advisory Advice</label>
              <textarea
                rows="2"
                value={form.advice}
                onChange={(e) => setForm({ ...form, advice: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold transition shadow-xs"
            >
              {isSubmitting ? 'Broadcasting...' : 'Broadcast to Student Portals'}
            </button>
          </form>
        </div>

        {/* Active Disruptions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
            <span>Active Corridor Disruptions ({disruptions.length})</span>
            <span className="text-xs text-slate-400 font-normal">Real-time sync</span>
          </h2>

          <div className="space-y-3">
            {disruptions.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {d.routeNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{d.routeName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      d.status === 'Active' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Segment:</strong> {d.affectedSegment} • <strong>Type:</strong> {d.type}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{d.advice}</p>
                </div>

                {d.status === 'Active' && (
                  <button
                    onClick={() => resolveDisruption(d.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition self-start sm:self-auto shrink-0"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
