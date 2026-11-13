import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AlertBanner from '../components/ui/AlertBanner';
import { useMobility } from '../context/MobilityContext';
import { AlertCircle, LayoutDashboard, Send, Route, Navigation2, Bus } from 'lucide-react';

export default function RootLayout() {
  const { activeAlert, showAlert, disruptions, journeys } = useMobility();

  const activeDisruption = disruptions.find((d) => d.status === 'Active' && d.severity === 'High');
  const activeJourney = journeys.find((j) => j.status === 'in-progress' || j.status === 'matched') || journeys[0];

  const mobileNavItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Request', to: '/request-journey', icon: Send },
    { name: 'Journeys', to: '/my-journeys', icon: Route },
    { name: 'Radar', to: activeJourney ? `/tracking/${activeJourney.id}` : '/my-journeys', icon: Navigation2 },
    { name: 'Buses', to: '/onward-bus', icon: Bus },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. System Flash Banner */}
      <AlertBanner alert={activeAlert} onDismiss={() => showAlert(null)} />

      {/* 2. Urgent Disruption Global Top Notification Bar */}
      {activeDisruption && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 animate-bounce shrink-0" />
              <span className="truncate">
                <strong>Transit Emergency:</strong> {activeDisruption.routeNumber} -{' '}
                {activeDisruption.affectedSegment} ({activeDisruption.type}). Community dispatch requested.
              </span>
            </div>
            <Link
              to="/request-journey"
              state={{
                busNumber: activeDisruption.routeNumber,
                pickupLocation: activeDisruption.affectedSegment || 'Mavoor Road Bus Stand',
                reason: `Emergency Bus Breakdown (${activeDisruption.routeNumber})`,
                notes: `${activeDisruption.affectedSegment} - ${activeDisruption.type}. Community dispatch requested.`,
                urgency: 'High',
              }}
              className="px-2.5 py-1 bg-white text-rose-700 font-bold rounded hover:bg-rose-50 transition shrink-0"
            >
              Request Backup Ride
            </Link>
          </div>
        </div>
      )}

      {/* 3. Main Navigation */}
      <Navbar />

      {/* 4. Body Content with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 5. Mobile Bottom Navigation Bar (Fingertip Access on Phone screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition-colors ${
                  isActive
                    ? 'text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
