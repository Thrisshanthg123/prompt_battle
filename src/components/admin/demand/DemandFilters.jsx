import React from 'react';
import { Filter, Calendar, MapPin, Search, RotateCcw } from 'lucide-react';

export default function DemandFilters({
  dateRange = '7d',
  setDateRange,
  selectedVillage = 'all',
  setSelectedVillage,
  villagesList = [],
  searchQuery = '',
  setSearchQuery,
  onReset,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search village, route, or transit risk factor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Village Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="py-2 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Rural Hubs ({villagesList.length})</option>
              {villagesList.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector Pill */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDateRange(d.id)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  dateRange === d.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {onReset && (
            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
