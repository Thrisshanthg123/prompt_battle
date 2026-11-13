import React from 'react';
import { Database, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DataSourceBadge({
  isSynthetic = true,
  source = 'Simulated Demo Data (Member 4 Backend Offline)',
  lastUpdated,
  onRefresh,
  isLoading = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isSynthetic ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isSynthetic ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <strong className="text-slate-800">
              {isSynthetic ? 'Data Source: Simulated Demo Dataset' : 'Data Source: Live Member 4 API'}
            </strong>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isSynthetic
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {isSynthetic ? 'Demo Fallback Mode' : 'Connected to Backend'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            {source} • Last Synced: <strong>{lastUpdated || 'Just now'}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
