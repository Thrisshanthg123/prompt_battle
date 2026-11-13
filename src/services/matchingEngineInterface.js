
import { runMatching } from './matchingEngine.js';

/**
 * Member 2 - SANCHAARI Matching Engine Integration
 *
 * Connects the deterministic matching engine to the
 * shared student and vehicle management system.
 */

export function matchJourneyRequest(
  request,
  availableVehicles = [],
  existingAllocations = []
) {
  const result = runMatching({
    requests: [request],
    vehicles: availableVehicles,
    existingAllocations,
  });

  const allocation = result.allocations[0];

  if (!allocation) {
    return {
      match: null,
      allocations: [],
      updatedVehicles: result.updatedVehicles,
      unallocatedRequests: result.unallocatedRequests,
      summary: result.summary,
    };
  }

  const vehicle = result.updatedVehicles.find(
    (item) => item.id === allocation.vehicleId
  );

  const match = {
    id: vehicle.id,
    driverName:
      vehicle.driverName || vehicle.ownerName || 'Vehicle Owner',
    driverPhone:
      vehicle.driverPhone || vehicle.contactNumber || '',
    vehicleType: vehicle.vehicleType || 'Community Vehicle',
    vehicleNumber:
      vehicle.vehicleNumber || vehicle.registrationNumber || '',
    rating: vehicle.rating ?? null,
    totalTrips: vehicle.totalTrips ?? null,
    allocationId: allocation.id,
    score: allocation.score,
    scoreBreakdown: allocation.scoreBreakdown,
    explanation: allocation.explanation,

    // Do not invent ETA or GPS information.
    eta: null,
    liveLocation: null,
  };

  return {
    match,
    allocations: result.allocations,
    updatedVehicles: result.updatedVehicles,
    unallocatedRequests: result.unallocatedRequests,
    summary: result.summary,
  };
}

/**
 * Backward-compatible function for existing components.
 * Returns a matched vehicle or null.
 */
export async function findBestVehicleMatch(
  request,
  availableVehicles = []
) {
  const result = matchJourneyRequest(request, availableVehicles);

  return result.match;
}
