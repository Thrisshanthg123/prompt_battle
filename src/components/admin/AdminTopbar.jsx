import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  ShieldAlert,
  AlertTriangle,
  User,
  Clock,
  Layers,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Car,
  X,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import { formatAdminTime } from '../../utils/adminHelpers';

const ROUTE_TITLES = {
  '/admin/dashboard': 'Executive Overview & Operations Center',
  '/admin/requests': 'Student Journey Requests & Real-time Allocations',
  '/admin/vehicles': 'Community Fleet & Vehicle Registry',
  '/admin/disruptions': 'Intelligent Disruption & Breakdown Management',
  '/admin/buses': 'Major Bus Junctions & Government Transit Tracking',
  '/admin/demand': 'Predictive Demand Intelligence & AI Forecasting',
  '/admin/analytics': 'Operational Performance & Network Analytics',
};

export default function AdminTopbar({ onOpenBreakdownModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { disruptions, activityLogs, vehicles, resetAllData } = useMobility();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');
  const brokenVehicles = vehicles.filter((v) => v.status === 'breakdown');

  const currentTitle = ROUTE_TITLES[location.pathname] || 'Admin Management Center';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Current Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>SANCHAARI Operations</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate capitalize">
                {location.pathname.replace('/admin/', '').replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {currentTitle}
            </h1>
          </div>
        </div>

        {/* Center: Active Disruption Flash Banner (if any) */}
        {activeDisruptions.length > 0 && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {activeDisruptions.length} Active Disruption{activeDisruptions.length > 1 ? 's' : ''}:{' '}
              {activeDisruptions[0].routeNumber} - {activeDisruptions[0].affectedSegment}
            </span>
            <Link
              to="/admin/disruptions"
              className="ml-1 underline font-bold hover:text-rose-950 text-[11px]"
            >
              Resolve
            </Link>
          </div>
        )}

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Clock Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime} IST</span>
          </div>

          {/* Quick Breakdown Simulation Action Button */}
          {onOpenBreakdownModal && (
            <button
              onClick={onOpenBreakdownModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Breakdown</span>
            </button>
          )}

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="System Activity & Alerts"
            >
              <Bell className="w-5 h-5" />
              {activeDisruptions.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    System Activity Stream ({activityLogs.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {activityLogs.length === 0 ? (
                    <p className="p-4 text-xs text-slate-400 text-center">No recent activity logs.</p>
                  ) : (
                    activityLogs.slice(0, 7).map((log) => (
                      <div key={log.id} className="p-3 text-xs hover:bg-slate-50 transition">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              log.severity === 'critical'
                                ? 'text-rose-700'
                                : log.severity === 'success'
                                ? 'text-emerald-700'
                                : 'text-blue-700'
                            }`}
                          >
                            {log.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatAdminTime(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                          {log.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 px-3 border-t border-slate-100 text-center">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    View All Activity on Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin Officer</p>
                <p className="text-[10px] text-slate-500 leading-tight">Kozhikode Hub #11</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AO
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Regional Mobility Officer</p>
                  <p className="text-[11px] text-slate-500">operations@sanchaari.kerala.gov.in</p>
                  <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Administrator Access
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  >
                    Operations Overview
                  </Link>
                  <Link
                    to="/admin/disruptions"
                    onClick={() => setShowProfileMenu(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  >
                    Disruption Management
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setShowProfileMenu(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  >
                    Switch to Student Portal
                  </Link>
                  <Link
                    to="/community-portal"
                    onClick={() => setShowProfileMenu(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  >
                    Switch to Vehicle Portal
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      resetAllData();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold"
                  >
                    Reset System Data Seeds
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
