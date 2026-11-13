import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AlertBanner from '../components/ui/AlertBanner';
import { useMobility } from '../context/MobilityContext';
import { AlertCircle } from 'lucide-react';

export default function RootLayout() {
  const { activeAlert, showAlert, disruptions } = useMobility();

  const activeDisruption = disruptions.find((d) => d.status === 'Active' && d.severity === 'High');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. System Flash Banner */}
      <AlertBanner alert={activeAlert} onDismiss={() => showAlert(null)} />

      {/* 2. Urgent Disruption Global Top Notification Bar */}
      {activeDisruption && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>
                <strong>Transit Emergency:</strong> {activeDisruption.routeNumber} -{' '}
                {activeDisruption.affectedSegment} ({activeDisruption.type}). Community dispatch requested.
              </span>
            </div>
            <Link
              to="/request-journey"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
