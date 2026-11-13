import React, { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
  BarChart3,
  Layers,
} from 'lucide-react';
import { getRecommendationPriorityBadge } from '../../../utils/demandHelpers';

export default function AIRecommendations({ recommendations = [], onAcknowledge }) {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  const filteredRecs = recommendations.filter((rec) => {
    if (selectedPriority === 'all') return true;
    return rec.priority.toLowerCase() === selectedPriority.toLowerCase();
  });

  const handleAction = (rec) => {
    setAcknowledgedIds((prev) => new Set(prev).add(rec.id));
    if (onAcknowledge) onAcknowledge(rec);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              AI Transport Recommendations
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {recommendations.length} Actionable Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data-driven proactive dispatch adjustments recommended by Member 4's predictive model to prevent student transit bottlenecks.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'critical', label: 'Critical' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPriority(p.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedPriority === p.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => {
          const badge = getRecommendationPriorityBadge(rec.priority);
          const isAcked = acknowledgedIds.has(rec.id);

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md ${
                badge.borderClass
              } ${isAcked ? 'bg-slate-50 opacity-80' : badge.cardBg}`}
            >
              <div className="space-y-3">
                {/* Header Strip: Priority Badge, Confidence, Time */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full ${badge.badgeClass}`}>
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                      ★ {rec.confidenceScore}% Confidence
                    </span>
                  </div>
                </div>

                {/* Route & Village */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{rec.route}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
                    Origin Hub: {rec.village}
                  </span>
                </div>

                {/* Identified Problem */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>Identified Bottleneck</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{rec.problem}</p>
                </div>

                {/* Supporting Numerical Evidence Chips */}
                {rec.supportingData && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 bg-white/90 rounded-xl border border-slate-200/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Projected Demand</span>
                      <strong className="text-slate-800 font-bold">
                        {rec.supportingData.projectedDemand} Pax
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Legal Capacity</span>
                      <strong className="text-slate-800 font-bold">
                        {rec.supportingData.currentCapacity} Seats
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Seat Shortage</span>
                      <strong className="text-rose-700 font-bold">
                        -{rec.supportingData.seatShortage} Deficit
                      </strong>
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                <div className="p-3 bg-white/90 rounded-xl border border-blue-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>Recommended Dispatch Action</span>
                  </span>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {rec.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Card Footer: Time, Impact, and Action Button */}
              <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{rec.relevantTimePeriod}</span>
                </div>

                <button
                  onClick={() => handleAction(rec)}
                  disabled={isAcked}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                    isAcked
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isAcked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Action Dispatched</span>
                    </>
                  ) : (
                    <>
                      <span>Implement Action</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
