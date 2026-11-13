import React from 'react';
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  Clock,
  Car,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AIInsightsPanel({
  busiestVillage = 'Kunnamangalam Hub',
  shortageRoutes = ['Mavoor Road → GECK Gate', 'Balussery Ghat → City Central'],
  nextPeakPeriod = '08:00 AM – 09:15 AM (Morning Arrival)',
  targetHubsForVehicles = ['Mavoor Road Hub (4 Autos)', 'Balussery Ghat Stand (2 Vans)'],
  overview = {},
}) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Executive AI Synthesis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Strategic Demand Insights & Operations Advisory
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
            Synthesized by Member 4's machine learning engine from trip histories, campus timetables, and transit disruptions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-indigo-900/50 px-3 py-1.5 rounded-xl border border-indigo-700/50 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-indigo-200 font-mono">Model Accuracy: 92.6%</span>
        </div>
      </div>

      {/* 4 Core Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Question 1: Highest Demand Villages */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>1. Highest Demand Hub</span>
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {busiestVillage}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Generates <strong>58 daily requests</strong> (31% of regional demand). Driven by multi-college interchange traffic near the bus bay.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-indigo-300 font-mono">
            Supporting Metric: 58 Pax / Day
          </div>
        </div>

        {/* Question 2: Expected Peak Window */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Next Critical Peak</span>
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {nextPeakPeriod}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Anticipated surge of <strong>92 student passengers</strong> vs. 50 available seats, creating a net deficit of 42 unallocated seats.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300 font-mono">
            Surge Factor: 2.1x Baseline
          </div>
        </div>

        {/* Question 3: Severe Shortage Routes */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>3. Recurring Shortages</span>
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {shortageRoutes[0]}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Consistently experiences <strong>16-18 unallocated students</strong> due to 50% seat deficit and KSRTC Route 42 breakdown frequency.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-rose-300 font-mono">
            Seat Deficit: -16 to -18 Seats
          </div>
        </div>

        {/* Question 4: Targeted Driver Incentives */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Recommended Influx</span>
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {targetHubsForVehicles[0]}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Deploy 4 additional registered autos at Mavoor Hub and 2 van carpools at Balussery Ghat between 07:45 AM – 08:45 AM.
            </p>
          </div>
          <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-300 font-mono">
            Target Addition: +28 Seats
          </div>
        </div>
      </div>
    </div>
  );
}
