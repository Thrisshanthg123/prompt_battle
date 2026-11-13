import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import DisruptionModal from '../components/admin/DisruptionModal';
import AlertBanner from '../components/ui/AlertBanner';
import { useMobility } from '../context/MobilityContext';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);

  const { activeAlert, showAlert, vehicles, journeys, simulateBreakdown } = useMobility();

  const handleConfirmBreakdown = async (vehicleId, options) => {
    return await simulateBreakdown(vehicleId, options);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* System Flash Alert Banner */}
      <AlertBanner alert={activeAlert} onDismiss={() => showAlert(null)} />

      {/* Main Admin Shell */}
      <div className="flex-1 flex overflow-hidden min-h-screen">
        {/* Admin Sidebar */}
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Admin Topbar */}
          <AdminTopbar onOpenBreakdownModal={() => setIsBreakdownModalOpen(true)} />

          {/* Page Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Outlet context={{ openBreakdownModal: () => setIsBreakdownModalOpen(true) }} />
          </main>
        </div>
      </div>

      {/* Global Vehicle Breakdown Simulation Modal */}
      <DisruptionModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        vehicles={vehicles}
        requests={journeys}
        onConfirmBreakdown={handleConfirmBreakdown}
      />
    </div>
  );
}
