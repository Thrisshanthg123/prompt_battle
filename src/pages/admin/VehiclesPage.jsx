import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Car,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Users,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import VehicleTable from '../../components/admin/VehicleTable';
import AdminStatCard from '../../components/admin/AdminStatCard';
import DisruptionModal from '../../components/admin/DisruptionModal';

export default function VehiclesPage() {
  const { vehicles, journeys, updateVehicle, simulateBreakdown, repairVehicle } = useMobility();
  const [selectedVehicleForBreakdown, setSelectedVehicleForBreakdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(
    (v) => v.status === 'available' && v.verified !== false && (v.availableSeats || 0) > 0
  ).length;
  const breakdownVehicles = vehicles.filter((v) => v.status === 'breakdown').length;
  const unverifiedVehicles = vehicles.filter((v) => v.verified === false).length;

  const handleSimulateBreakdownClick = (vehicleId) => {
    setSelectedVehicleForBreakdown(vehicleId);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (vehicleId) => {
    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;
    const nextStatus = veh.status === 'available' ? 'unavailable' : 'available';
    updateVehicle(vehicleId, { status: nextStatus });
  };

  const handleConfirmBreakdown = async (vehicleId, options) => {
    return await simulateBreakdown(vehicleId, options);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Community Vehicle Fleet Monitoring
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {totalVehicles} Vehicles Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor registered autos, carpools, and vans across campus corridors. Verify RTO permits and passenger capacity safety rules.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedVehicleForBreakdown(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Simulate Breakdown</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Fleet"
          value={totalVehicles}
          subtitle="Registered vehicles"
          icon={Car}
          color="blue"
        />

        <AdminStatCard
          title="Verified Available"
          value={availableVehicles}
          subtitle="Ready for dispatch"
          icon={ShieldCheck}
          color="emerald"
        />

        <AdminStatCard
          title="Vehicles in Breakdown"
          value={breakdownVehicles}
          subtitle={breakdownVehicles > 0 ? 'Under repair' : 'Fleet operational'}
          icon={AlertTriangle}
          color={breakdownVehicles > 0 ? 'rose' : 'emerald'}
        />

        <AdminStatCard
          title="Unverified / Ineligible"
          value={unverifiedVehicles}
          subtitle="Excluded from matching"
          icon={ShieldAlert}
          color={unverifiedVehicles > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Main Vehicle Table Component */}
      <VehicleTable
        vehicles={vehicles}
        requests={journeys}
        onSimulateBreakdown={handleSimulateBreakdownClick}
        onRepairVehicle={repairVehicle}
        onToggleStatus={handleToggleStatus}
      />

      {/* Breakdown Modal */}
      <DisruptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={vehicles}
        requests={journeys}
        onConfirmBreakdown={handleConfirmBreakdown}
      />
    </div>
  );
}
