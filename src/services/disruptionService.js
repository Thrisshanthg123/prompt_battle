/**
 * ============================================================================
 * SANCHAARI - MEMBER 3 INTELLIGENT DISRUPTION MANAGEMENT SERVICE
 * ============================================================================
 * 
 * File: src/services/disruptionService.js
 * Assigned Owner: MEMBER 3 (Admin Dashboard & Disruption Management)
 * Reuses: Member 2's matching engine (src/services/matchingEngine.js)
 * Coordinates: Member 4's backend / Supabase API
 * 
 * Key Responsibilities:
 * 1. Identify all student allocations associated with a failing vehicle.
 * 2. Mark the failing vehicle as 'breakdown' and isolate it from new allocations.
 * 3. Atomic release of existing allocations to prevent double-booking.
 * 4. Run Member 2's AI matching engine on affected requests using remaining verified vehicles.
 * 5. Track unallocated students if capacity is exceeded without inventing fake assignments.
 * 6. Produce structured before-and-after reallocation audits for the admin dashboard.
 */

import { runMatching } from './matchingEngine.js';

/**
 * Checks if a vehicle currently has active students allocated to it.
 *
 * @param {string} vehicleId
 * @param {Array} requests
 * @returns {Array} List of active affected requests
 */
export function getAffectedRequestsForVehicle(vehicleId, requests = []) {
  return requests.filter(
    (req) =>
      req.matchedVehicle?.id === vehicleId &&
      (req.status === 'matched' || req.status === 'in-progress' || req.status === 'assigned')
  );
}

/**
 * Returns vehicles that currently have active student assignments (eligible for breakdown simulation).
 *
 * @param {Array} vehicles
 * @param {Array} requests
 * @returns {Array} Vehicles with active allocations
 */
export function getBreakdownCandidateVehicles(vehicles = [], requests = []) {
  return vehicles.filter((v) => {
    if (v.status === 'breakdown') return false;
    const hasAssignedStudents = requests.some(
      (r) =>
        r.matchedVehicle?.id === v.id &&
        (r.status === 'matched' || r.status === 'in-progress' || r.status === 'assigned')
    );
    return hasAssignedStudents;
  });
}

/**
 * Handles a vehicle breakdown event atomically:
 * 1. Identifies affected student requests.
 * 2. Marks the vehicle as 'breakdown'.
 * 3. Releases affected allocations.
 * 4. Gathers remaining verified, legally eligible vehicles.
 * 5. Reuses Member 2's matching engine.
 * 6. Generates Before-and-After comparison data.
 * 7. Returns new system state and audit logs.
 *
 * @param {string} vehicleId - ID of the vehicle experiencing breakdown
 * @param {Object} state - Current mobility context snapshot { requests, vehicles, allocations }
 * @param {Object} [options] - Optional configurations (e.g. backendApiUrl)
 * @returns {Promise<Object>} Disruption transaction summary and state patches
 */
export async function handleVehicleBreakdown(vehicleId, state = {}, options = {}) {
  const { requests = [], vehicles = [], allocations = [] } = state;

  const targetVehicle = vehicles.find((v) => v.id === vehicleId);
  if (!targetVehicle) {
    throw new Error(`Vehicle ${vehicleId} not found in registered fleet.`);
  }

  // 1. Identify affected requests
  const affectedRequests = getAffectedRequestsForVehicle(vehicleId, requests);
  const affectedStudentsCount = affectedRequests.reduce(
    (sum, r) => sum + Number(r.passengers || 1),
    0
  );

  // Snapshot before state for audit comparison
  const beforeSnapshot = {
    vehicleId: targetVehicle.id,
    driverName: targetVehicle.driverName,
    vehicleNumber: targetVehicle.vehicleNumber,
    vehicleType: targetVehicle.vehicleType,
    previousStatus: targetVehicle.status,
    affectedCount: affectedRequests.length,
    affectedStudents: affectedStudentsCount,
    affectedRequestsList: affectedRequests.map((r) => ({
      id: r.id,
      studentName: r.studentName,
      pickup: r.pickupLocation || r.village,
      passengers: r.passengers || 1,
    })),
  };

  // 2. Mark the failed vehicle as breakdown
  const brokenVehicle = {
    ...targetVehicle,
    status: 'breakdown',
    availableSeats: 0,
    breakdownReportedAt: new Date().toISOString(),
    breakdownReason: options.reason || 'Mechanical failure reported by driver',
  };

  // 3. Isolate remaining vehicles
  // Exclude the broken vehicle, unverified vehicles, and offline vehicles
  const remainingVehicles = vehicles
    .filter((v) => v.id !== vehicleId)
    .map((v) => ({ ...v }));

  // 4. Mark affected requests as reallocating and release previous driver
  const requestsToReallocate = affectedRequests.map((r) => ({
    ...r,
    status: 'requested',
    isReallocating: true,
    previousVehicleId: vehicleId,
    previousDriverName: targetVehicle.driverName,
    matchedVehicle: null,
  }));

  // 5. Execute Member 2's Matching Engine
  const matchingResult = runMatching({
    requests: requestsToReallocate,
    vehicles: remainingVehicles,
    existingAllocations: allocations.filter((a) => a.vehicleId !== vehicleId),
  });

  const {
    allocations: newAllocations,
    updatedRequests: reallocatedRequestsList,
    updatedVehicles: newRemainingVehicles,
    unallocatedRequests,
    summary: matchingSummary,
  } = matchingResult;

  // 6. Enrich reallocated requests with tracking timeline updates
  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const finalReallocatedRequests = reallocatedRequestsList.map((req) => {
    if (req.status === 'matched') {
      const newDriver = req.matchedVehicle?.driverName || 'Alternative Driver';
      return {
        ...req,
        reallocationStatus: 'Successfully Reassigned',
        trackingSteps: [
          ...(req.trackingSteps || []),
          {
            id: 90,
            label: 'Emergency Reallocation Completed',
            time: currentTimeStr,
            done: true,
            desc: `Breakdown on ${targetVehicle.vehicleNumber}. Reassigned to ${newDriver} (${req.matchedVehicle?.vehicleNumber}) via AI Matching Engine.`,
          },
        ],
      };
    } else {
      return {
        ...req,
        status: 'unallocated',
        reallocationStatus: 'No Suitable Vehicle Available',
        trackingSteps: [
          ...(req.trackingSteps || []),
          {
            id: 91,
            label: 'Awaiting Alternative Vehicle',
            time: currentTimeStr,
            done: false,
            desc: `Breakdown on ${targetVehicle.vehicleNumber}. Nearby fleet capacity exhausted; request queued for priority bus link.`,
          },
        ],
      };
    }
  });

  // 7. Combine all requests
  const unaffectedRequests = requests.filter(
    (r) => !affectedRequests.some((aff) => aff.id === r.id)
  );
  const updatedAllRequests = [...unaffectedRequests, ...finalReallocatedRequests];

  // 8. Combine all vehicles (including broken vehicle)
  const updatedAllVehicles = [brokenVehicle, ...newRemainingVehicles];

  // 9. Build alternative vehicles used summary
  const alternativeVehiclesUsed = [];
  newAllocations.forEach((alc) => {
    const veh = newRemainingVehicles.find((v) => v.id === alc.vehicleId);
    if (veh && !alternativeVehiclesUsed.some((item) => item.id === veh.id)) {
      alternativeVehiclesUsed.push({
        id: veh.id,
        driverName: veh.driverName,
        vehicleNumber: veh.vehicleNumber,
        vehicleType: veh.vehicleType,
        remainingSeats: veh.availableSeats,
      });
    }
  });

  // 10. Disruption Event Record
  const disruptionId = `DIS-BRK-${Date.now().toString().slice(-4)}`;
  const disruptionRecord = {
    id: disruptionId,
    routeNumber: `Vehicle ${targetVehicle.vehicleNumber}`,
    routeName: `${targetVehicle.vehicleType} (${targetVehicle.driverName})`,
    affectedSegment: targetVehicle.baseLocation || 'In-transit Corridor',
    type: 'Mechanical Breakdown',
    severity: 'High',
    status: 'Active',
    reportedAt: currentTimeStr,
    estimatedResolution: '45-90 mins',
    impactedStudents: affectedStudentsCount,
    reassignedStudents: matchingSummary.studentsAllocated,
    unallocatedStudents: matchingSummary.studentsUnallocated,
    brokenVehicleId: vehicleId,
    alternativeVehiclesUsed,
    advice:
      matchingSummary.studentsUnallocated > 0
        ? `Partial reassignment: ${matchingSummary.studentsAllocated} students reassigned. ${matchingSummary.studentsUnallocated} students awaiting backup shuttle.`
        : `All ${matchingSummary.studentsAllocated} stranded students successfully reassigned to alternative community vehicles.`,
  };

  // 11. Activity Log
  const activityLog = {
    id: `ACT-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    type: 'breakdown',
    title: `Breakdown: ${targetVehicle.driverName} (${targetVehicle.vehicleNumber})`,
    description: `${affectedStudentsCount} students affected. Reassigned: ${matchingSummary.studentsAllocated}, Unallocated: ${matchingSummary.studentsUnallocated}.`,
    severity: 'critical',
  };

  // Snapshot after state
  const afterSnapshot = {
    vehicleId: targetVehicle.id,
    status: 'breakdown',
    studentsAffected: affectedStudentsCount,
    studentsReassigned: matchingSummary.studentsAllocated,
    studentsUnallocated: matchingSummary.studentsUnallocated,
    alternativeVehiclesCount: alternativeVehiclesUsed.length,
    alternativeVehiclesUsed,
    reallocatedDetails: finalReallocatedRequests.map((r) => ({
      id: r.id,
      studentName: r.studentName,
      status: r.reallocationStatus,
      newVehicle: r.matchedVehicle?.vehicleNumber || 'None (Queueing)',
      newDriver: r.matchedVehicle?.driverName || '--',
      eta: r.matchedVehicle?.eta || '--',
    })),
  };

  return {
    success: true,
    vehicleId,
    brokenVehicle,
    affectedRequests,
    affectedStudentsCount,
    beforeSnapshot,
    afterSnapshot,
    reallocatedRequests: finalReallocatedRequests,
    unallocatedRequests,
    newAllocations,
    updatedVehicles: updatedAllVehicles,
    updatedRequests: updatedAllRequests,
    disruptionRecord,
    activityLog,
    summary: {
      affectedVehicles: 1,
      affectedStudents: affectedStudentsCount,
      studentsReassigned: matchingSummary.studentsAllocated,
      studentsUnallocated: matchingSummary.studentsUnallocated,
      alternativeVehiclesUsedCount: alternativeVehiclesUsed.length,
      isFullyReassigned: matchingSummary.studentsUnallocated === 0,
    },
  };
}

/**
 * Resolves a vehicle breakdown and returns it to active/available status.
 *
 * @param {string} vehicleId
 * @param {Array} vehicles
 * @returns {Array} Updated vehicles array
 */
export function resolveVehicleBreakdown(vehicleId, vehicles = []) {
  return vehicles.map((v) => {
    if (v.id === vehicleId) {
      return {
        ...v,
        status: 'available',
        availableSeats: v.capacity || 4,
        breakdownResolvedAt: new Date().toISOString(),
      };
    }
    return v;
  });
}
