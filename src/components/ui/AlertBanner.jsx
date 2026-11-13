import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  const isWarning = alert.type === 'warning' || alert.type === 'danger';
  const isInfo = alert.type === 'info';

  const bgStyles = isWarning
    ? 'bg-amber-500 text-white border-amber-600'
    : isInfo
    ? 'bg-blue-600 text-white border-blue-700'
    : 'bg-emerald-600 text-white border-emerald-700';

  return (
    <div className={`px-4 py-2.5 shadow-md flex items-center justify-between transition-all ${bgStyles}`}>
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full text-sm font-medium">
        {isWarning ? (
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
        ) : isInfo ? (
          <Info className="w-5 h-5 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="flex-1">{alert.message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black/10 rounded transition text-white"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
