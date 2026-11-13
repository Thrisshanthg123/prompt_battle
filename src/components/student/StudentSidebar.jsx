import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Route,
  Bus,
  Sparkles,
  UserCheck,
  Car,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function StudentSidebar({ isCollapsed, setIsCollapsed, onOpenAssistant }) {
  const { journeys, disruptions, studentProfile } = useMobility();

  const activeJourneysCount = journeys.filter(
    (j) => j.status === 'in-progress' || j.status === 'matched' || j.status === 'requested'
  ).length;

  const activeDisruptionsCount = disruptions.filter((d) => d.status === 'Active').length;

  const navItems = [
    {
      name: 'Dashboard',
      to: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Request Transportation',
      to: '/student/request',
      icon: Send,
      highlight: true,
    },
    {
      name: 'My Journeys',
      to: '/student/journeys',
      icon: Route,
      badge: activeJourneysCount > 0 ? activeJourneysCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'Onward Bus Information',
      to: '/student/buses',
      icon: Bus,
      badge: activeDisruptionsCount > 0 ? `${activeDisruptionsCount} Alert` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'AI Travel Assistant',
      to: '/student/assistant',
      icon: Sparkles,
      tag: 'AI',
    },
    {
      name: 'Student Profile',
      to: '/student/profile',
      icon: UserCheck,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <Link to="/student/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-600/20 shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight">
                    SANCHAARI
                  </span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Student
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  "When the bus stops, the journey doesn't."
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Verified Student Badge */}
        {!isCollapsed && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-900 font-semibold truncate">
                {studentProfile.institution || 'GECK Kozhikode'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Student Transit Hub
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/student/dashboard'}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-emerald-600 group-hover:text-white' : ''}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.tag && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                      {item.tag}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Cross-Portal Switchers */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {!isCollapsed ? (
          <div className="space-y-1 text-xs">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Developer & Admin Portals
            </p>
            <Link
              to="/community-portal"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-amber-900 hover:bg-amber-50/80 transition"
            >
              <div className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>Vehicle Portal (M2)</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <Link
              to="/admin/dashboard"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-purple-900 hover:bg-purple-50/80 transition"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Operations (M3)</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Link
              to="/community-portal"
              title="Switch to Community Vehicle Portal (Member 2)"
              className="p-2 rounded-xl text-slate-500 hover:text-amber-800 hover:bg-amber-50"
            >
              <Car className="w-4 h-4 text-amber-600" />
            </Link>
            <Link
              to="/admin/dashboard"
              title="Switch to Admin Dashboard (Member 3)"
              className="p-2 rounded-xl text-slate-500 hover:text-purple-800 hover:bg-purple-50"
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
