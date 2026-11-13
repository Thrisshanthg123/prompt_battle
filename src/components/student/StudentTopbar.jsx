import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bus,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Clock,
  PhoneCall,
  User,
  Radio,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function StudentTopbar({ onOpenAssistant }) {
  const { studentProfile, disruptions, resetAllData, triggerSosAlert, journeys } = useMobility();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');
  const activeJourney = journeys.find(
    (j) => j.status === 'in-progress' || j.status === 'matched'
  );

  const handleSos = () => {
    const confirmed = window.confirm(
      `DISPATCH EMERGENCY SOS?\n\nThis will immediately transmit your real-time GPS coordinates and route telemetry to your guardian (${studentProfile.emergencyContact.name}) and Campus Security.`
    );
    if (confirmed) {
      triggerSosAlert(activeJourney?.id || 'GLOBAL-SOS');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Active Transit Corridor Alert Pill */}
        <div className="flex items-center gap-3 min-w-0">
          {activeDisruptions.length > 0 ? (
            <Link
              to="/student/buses"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition animate-pulse truncate"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">
                {activeDisruptions[0].routeNumber}: {activeDisruptions[0].affectedSegment}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Campus Transit Network Active</span>
            </div>
          )}
        </div>

        {/* Right: Quick Controls, SOS, AI Assistant, and Student Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Clock */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime}</span>
          </div>

          {/* SOS Emergency Dispatch Button */}
          <button
            onClick={handleSos}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition hover:scale-102"
            title="Dispatch emergency alert to college security and parents"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          {/* AI Travel Assistant Trigger */}
          <Link
            to="/student/assistant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">AI Travel Assistant</span>
          </Link>

          {/* Reset Demo State */}
          <button
            onClick={resetAllData}
            title="Reset demo data seeds"
            className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Student Profile Pill */}
          <Link
            to="/student/profile"
            className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {studentProfile.name}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">Student Portal</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {studentProfile.name.charAt(0)}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
