import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  AlertOctagon,
  Bus,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Radio,
  RotateCcw,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const { journeys, vehicles, disruptions, resetAllData } = useMobility();

  const pendingRequestsCount = journeys.filter((j) => j.status === 'requested').length;
  const activeDisruptionsCount = disruptions.filter((d) => d.status === 'Active').length;
  const breakdownVehiclesCount = vehicles.filter((v) => v.status === 'breakdown').length;

  const navItems = [
    {
      name: 'Overview',
      to: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Student Requests',
      to: '/admin/requests',
      icon: Users,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Community Fleet',
      to: '/admin/vehicles',
      icon: Car,
      badge: breakdownVehiclesCount > 0 ? `${breakdownVehiclesCount} Alert` : null,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      name: 'Disruptions',
      to: '/admin/disruptions',
      icon: AlertOctagon,
      badge: activeDisruptionsCount > 0 ? activeDisruptionsCount : null,
      badgeColor: 'bg-rose-600 text-white animate-pulse',
    },
    {
      name: 'Bus Information',
      to: '/admin/buses',
      icon: Bus,
    },
    {
      name: 'Demand Intelligence',
      to: '/admin/demand',
      icon: Sparkles,
      highlight: true,
    },
    {
      name: 'Operations Analytics',
      to: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-200 transition-all duration-300 ease-in-out border-r border-slate-800 flex flex-col justify-between shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              S
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">
                    SANCHAARI
                  </span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Mobility Command Center
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live System Operational Indicator */}
        {!isCollapsed && (
          <div className="mt-3.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">Network Online</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Hub #11</span>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations & Fleet
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/admin/dashboard'}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-indigo-400' : ''}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Switcher & Support Links */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {!isCollapsed ? (
          <div className="space-y-1 text-xs">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Portal Switchers
            </p>
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <span>Student Portal (M1)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/community-portal"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <span>Community Fleet (M2)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={resetAllData}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition text-left mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seeds</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Link
              to="/"
              title="Switch to Student Portal"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={resetAllData}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
