import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, User, ShieldAlert, Sparkles, RotateCcw, Menu, X, Car, LayoutDashboard, Send, Route, Navigation2 } from 'lucide-react';
import { useMobility } from '../context/MobilityContext';

export default function Navbar() {
  const { studentProfile, disruptions, resetAllData } = useMobility();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeDisruptionsCount = disruptions.filter((d) => d.status === 'Active').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">SANCHAARI</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  AI Mobility
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                "When the bus stops, the journey doesn't."
              </p>
            </div>
          </Link>

          {/* Center: Disruption Quick Alert Indicator */}
          {activeDisruptionsCount > 0 && (
            <Link
              to="/onward-bus"
              className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition animate-pulse"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{activeDisruptionsCount} Transit Disruptions Active</span>
            </Link>
          )}

          {/* Right: Reset Data, Portal Switcher, and Student Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetAllData}
              title="Reset state to initial mock data (useful for testing)"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            {/* Student Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 pl-3 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{studentProfile.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight">Student Portal</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow">
                {studentProfile.name.charAt(0)}
              </div>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {activeDisruptionsCount > 0 && (
            <Link
              to="/onward-bus"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{activeDisruptionsCount} Transit Disruptions Active</span>
              </span>
              <span className="text-[10px] font-bold underline">View</span>
            </Link>
          )}

          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">Student Portal</p>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/request-journey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Request Community Ride</span>
            </Link>
            <Link
              to="/my-journeys"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Route className="w-4 h-4 text-emerald-600" />
              <span>My Journeys</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Student Profile</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">Team Modules</p>
            <Link
              to="/community-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-600" />
                <span>Community Vehicles</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Member 2</span>
            </Link>
            <Link
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>Disruptions & Admin</span>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Member 3</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                resetAllData();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
