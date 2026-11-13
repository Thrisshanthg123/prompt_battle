import React, { useState } from 'react';
import {
  AlertTriangle,
  Car,
  Users,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Loader2,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { getBreakdownCandidateVehicles, getAffectedRequestsForVehicle } from '../../services/disruptionService';

export default function DisruptionModal({
  isOpen,
  onClose,
  vehicles = [],
  requests = [],
  onConfirmBreakdown,
}) {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [breakdownReason, setBreakdownReason] = useState('Mechanical failure / Engine breakdown');
  const [step, setStep] = useState(1); // 1: Select, 2: Confirm, 3: Processing
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Candidate vehicles: only those with active student assignments
  const candidateVehicles = getBreakdownCandidateVehicles(vehicles, requests);

  // If none selected, default to first candidate
  const currentSelectionId = selectedVehicleId || (candidateVehicles[0]?.id ?? '');
  const selectedVehicle = vehicles.find((v) => v.id === currentSelectionId);
  const affectedRequests = selectedVehicle ? getAffectedRequestsForVehicle(selectedVehicle.id, requests) : [];
  const affectedStudentsCount = affectedRequests.reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const handleNextToConfirm = () => {
    if (!currentSelectionId) return;
    setSelectedVehicleId(currentSelectionId);
    setStep(2);
  };

  const handleExecuteBreakdown = async () => {
    setIsProcessing(true);
    setStep(3);

    try {
      // Small simulated delay for realistic AI matching execution UX
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onConfirmBreakdown(currentSelectionId, { reason: breakdownReason });
      setIsProcessing(false);
      onClose();
    } catch (err) {
      setIsProcessing(false);
      setStep(2);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setStep(1);
    setSelectedVehicleId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Simulate Vehicle Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Member 3 Intelligent Disruption & Automatic Reallocation Engine
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Vehicle */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Select an actively assigned community vehicle to trigger a simulated breakdown. The platform will automatically identify all affected students, release allocations, and execute Member 2's matching engine to find alternative rides.
            </p>

            {candidateVehicles.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <AlertOctagon className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-bold text-amber-900 text-sm">No Vehicles with Active Allocations</h4>
                <p className="text-xs text-amber-700 max-w-md mx-auto">
                  All community vehicles are currently idle, available, or already under breakdown. To test the reallocation workflow, ensure at least one vehicle has an active student assignment.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {candidateVehicles.map((veh) => {
                  const reqs = getAffectedRequestsForVehicle(veh.id, requests);
                  const isSelected = (selectedVehicleId || candidateVehicles[0]?.id) === veh.id;
                  const studentCount = reqs.reduce((sum, r) => sum + Number(r.passengers || 1), 0);

                  return (
                    <div
                      key={veh.id}
                      onClick={() => setSelectedVehicleId(veh.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-1 ring-rose-500/50'
                          : 'border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-slate-900">
                              {veh.driverName}
                            </strong>
                            <span className="font-mono text-[11px] bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-700">
                              {veh.vehicleNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {veh.vehicleType} • Hub: {veh.baseLocation}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                          {studentCount} student{studentCount > 1 ? 's' : ''} assigned
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={candidateVehicles.length === 0}
                onClick={handleNextToConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition"
              >
                <span>Continue to Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm Breakdown */}
        {step === 2 && selectedVehicle && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Confirm Breakdown Simulation</span>
              </div>
              <p className="text-rose-800 leading-relaxed">
                You are about to simulate a breakdown for vehicle{' '}
                <strong>
                  {selectedVehicle.vehicleNumber} ({selectedVehicle.driverName})
                </strong>
                .
              </p>
            </div>

            {/* Affected Students List Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Affected Student Requests ({affectedRequests.length})</span>
                <span className="text-rose-700 font-bold">{affectedStudentsCount} Total Students</span>
              </h4>

              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {affectedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-slate-900">{req.studentName}</strong>
                      <p className="text-[10px] text-slate-500">
                        {req.pickupLocation} → {req.destinationLocation}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {req.passengers || 1} Pax
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown Cause Select */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-700">Simulation Failure Reason</label>
              <select
                value={breakdownReason}
                onChange={(e) => setBreakdownReason(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Mechanical failure / Engine breakdown">Mechanical failure / Engine breakdown</option>
                <option value="Severe tyre puncture / Axle damage">Severe tyre puncture / Axle damage</option>
                <option value="Battery drain (EV Auto Rickshaw)">Battery drain (EV Auto Rickshaw)</option>
                <option value="Roadblock / Bridge flood on route">Roadblock / Bridge flood on route</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Back to Selection
              </button>

              <button
                onClick={handleExecuteBreakdown}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 inline-flex items-center gap-2 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Trigger Breakdown & Reallocate</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Processing Animation */}
        {step === 3 && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Executing Intelligent Disruption Protocol...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Isolating failed vehicle, releasing student allocations, and executing Member 2's AI Matching Engine against available verified fleet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
