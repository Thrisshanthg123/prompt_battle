import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Route,
  Navigation2,
  Bus,
  UserCheck,
  Car,
  ShieldAlert,
  Code2,
} from 'lucide-react';
import { useMobility } from '../context/MobilityContext';

export default function Sidebar() {
  const { journeys } = useMobility();

  const activeJourneysCount = journeys.filter(
    (j) => j.status === 'in-progress' || j.status === 'matched' || j.status === 'requested'
  ).length;

  const firstActiveJourney = journeys.find((j) => j.status === 'in-progress' || j.status === 'matched') || journeys[0];

  const studentLinks = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Request Journey', to: '/request-journey', icon: Send },
    {
      name: 'My Journeys',
      to: '/my-journeys',
      icon: Route,
      badge: activeJourneysCount > 0 ? activeJourneysCount : null,
    },
    {
      name: 'Live Tracking',
      to: firstActiveJourney ? `/tracking/${firstActiveJourney.id}` : '/my-journeys',
      icon: Navigation2,
      highlight: true,
    },
    { name: 'Onward Bus Info', to: '/onward-bus', icon: Bus },
    { name: 'Student Profile', to: '/profile', icon: UserCheck },
  ];

  const teammateLinks = [
    {
      name: 'Community Vehicles',
      to: '/community-portal',
      icon: Car,
      tag: 'Member 2',
      tagColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Disruptions & Admin',
      to: '/admin-dashboard',
      icon: ShieldAlert,
      tag: 'Member 3',
      tagColor: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Section: Member 1 - Student Mobility Hub */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Student Portal (Member 1)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>

          <nav className="space-y-1">
            {studentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Section: Teammate Modules & Stubs */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Team Modules
            </span>
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <nav className="space-y-1">
            {teammateLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Pill inside Sidebar */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1 mt-6">
        <p className="font-bold text-slate-800">SANCHAARI Core v1.0</p>
        <p className="text-[11px] text-slate-500">
          Community-Driven First/Last Mile & Breakdown Coordinator
        </p>
      </div>
    </aside>
  );
}
