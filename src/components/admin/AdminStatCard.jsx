import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-700',
    iconBg: 'bg-blue-600 text-white',
    ring: 'focus:ring-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-600 text-white',
    ring: 'focus:ring-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-700',
    iconBg: 'bg-amber-600 text-white',
    ring: 'focus:ring-amber-400',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    text: 'text-rose-700',
    iconBg: 'bg-rose-600 text-white',
    ring: 'focus:ring-rose-400',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    text: 'text-indigo-700',
    iconBg: 'bg-indigo-600 text-white',
    ring: 'focus:ring-indigo-400',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-700',
    iconBg: 'bg-purple-600 text-white',
    ring: 'focus:ring-purple-400',
  },
};

export default function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
  onClick,
  badgeText,
}) {
  const scheme = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {value}
            </span>
            {badgeText && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scheme.bg} ${scheme.text}`}>
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 font-medium truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold shrink-0 ${
                trendDirection === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
