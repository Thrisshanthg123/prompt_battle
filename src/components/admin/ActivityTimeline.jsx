import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Car,
  UserPlus,
  Send,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import { formatAdminTime, formatAdminDate } from '../../utils/adminHelpers';

const TYPE_CONFIG = {
  breakdown: {
    icon: AlertTriangle,
    bg: 'bg-rose-100 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  disruption: {
    icon: ShieldAlert,
    bg: 'bg-rose-100 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  allocation: {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  vehicle: {
    icon: Car,
    bg: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  request: {
    icon: Send,
    bg: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  info: {
    icon: CheckCircle2,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
};

export default function ActivityTimeline({ maxItems = 10, showFilters = true }) {
  const { activityLogs } = useMobility();
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = (activityLogs || []).filter((log) => {
    if (filterType === 'all') return true;
    if (filterType === 'disruptions') return log.type === 'breakdown' || log.type === 'disruption';
    if (filterType === 'allocations') return log.type === 'allocation';
    if (filterType === 'requests') return log.type === 'request';
    if (filterType === 'vehicles') return log.type === 'vehicle';
    return true;
  });

  const displayedLogs = filteredLogs.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter Timeline:</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'disruptions', label: 'Disruptions & Breakdowns' },
              { id: 'allocations', label: 'Allocations' },
              { id: 'requests', label: 'Student Requests' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {displayedLogs.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-500">No activity events matching selected filter.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {displayedLogs.map((log) => {
            const conf = TYPE_CONFIG[log.type] || TYPE_CONFIG.info;
            const Icon = conf.icon;

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${conf.bg}`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                {/* Event Card */}
                <div className="bg-slate-50/70 group-hover:bg-white group-hover:shadow-xs p-3.5 rounded-xl border border-slate-200/80 transition">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {log.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatAdminTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {log.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
