/**
 * ============================================================================
 * SANCHAARI - MEMBER 2 AI MATCHING ENGINE CONTRACT & IMPLEMENTATION
 * ============================================================================
 * 
 * File: src/services/matchingEngine.js
 * Assigned Owner: MEMBER 2 (Community Vehicle Portal & AI Matching Engine)
 * Reused by: MEMBER 3 (Disruption Management & Automatic Reallocation)
 * 
 * Contract:
 * export function runMatching({ requests, vehicles, existingAllocations })
 * 
 * Returns:
 * {
 *   allocations: Array,
 *   updatedRequests: Array,
 *   updatedVehicles: Array,
 *   unallocatedRequests: Array,
 *   summary: {
 *     totalRequests: number,
 *     allocatedRequests: number,
 *     unallocatedRequests: number,
 *     studentsAllocated: number,
 *     studentsUnallocated: number
 *   }
 * }
 */

/**
 * Geographic corridor distance/proximity heuristic matrix for Kozhikode rural hubs.
 * Score is between 0 (distant/incompatible) and 1.0 (exact corridor match).
 */
const CORRIDOR_PROXIMITY_MATRIX = {
  'Mavoor Road': {
    'Mavoor Road': 1.0,
    'Mavoor Road Bus Stand': 1.0,
    'Medical College': 0.85,
    'Kunnamangalam': 0.7,
    'GECK Campus': 0.65,
    'Karanthur': 0.6,
  },
  'Kunnamangalam': {
    'Kunnamangalam': 1.0,
    'Kunnamangalam Junction': 1.0,
    'Kunnamangalam Bus Bay': 1.0,
    'GECK Campus': 0.95,
    'GECK Campus Main Gate': 0.95,
    'NIT Calicut': 0.9,
    'Karanthur': 0.85,
    'Kuttikkattoor': 0.75,
    'Mavoor Road': 0.7,
  },
  'GECK Campus': {
    'GECK Campus': 1.0,
    'GECK Campus Main Gate': 1.0,
    'Kunnamangalam': 0.95,
    'NIT Calicut': 0.9,
    'Medical College': 0.7,
  },
  'Medical College': {
    'Medical College': 1.0,
    'Medical College Junction': 1.0,
    'Mavoor Road': 0.85,
    'Kunnamangalam': 0.7,
    'GECK Campus': 0.7,
    'Palayam': 0.8,
  },
  'Palayam': {
    'Palayam': 1.0,
    'Palayam Bus Stand': 1.0,
    'Central Railway Station': 0.95,
    'Medical College': 0.8,
    'Mavoor Road': 0.75,
  },
};

/**
 * Calculates corridor proximity score between request pickup/destination and vehicle base/corridor.
 */
function calculateProximityScore(request, vehicle) {
  const reqLoc = request.pickupLocation || request.village || '';
  const vehLoc = vehicle.baseLocation || vehicle.currentLocation || '';

  // Direct string inclusion
  if (vehLoc && reqLoc && (vehLoc.toLowerCase().includes(reqLoc.toLowerCase()) || reqLoc.toLowerCase().includes(vehLoc.toLowerCase()))) {
    return 1.0;
  }

  // Look up closest corridor in matrix
  for (const [corridorA, matches] of Object.entries(CORRIDOR_PROXIMITY_MATRIX)) {
    if (reqLoc.toLowerCase().includes(corridorA.toLowerCase())) {
      for (const [corridorB, score] of Object.entries(matches)) {
        if (vehLoc.toLowerCase().includes(corridorB.toLowerCase())) {
          return score;
        }
      }
    }
  }

  // Baseline general rural proximity
  return 0.5;
}

/**
 * Runs the matching engine to allocate pending student requests to eligible community vehicles.
 *
 * Rules:
 * 1. Only verified, active, non-breakdown vehicles are eligible.
 * 2. Never exceed vehicle availableSeats.
 * 3. Prioritizes requests by Urgency (High > Medium > Low) and creation timestamp.
 * 4. Scores candidate vehicles based on capacity fit, route proximity, and driver rating.
 * 5. Returns updated requests, updated vehicles, new allocations, and a comprehensive summary.
 *
 * @param {Object} params
 * @param {Array} params.requests - List of journey requests to match
 * @param {Array} params.vehicles - List of community vehicles
 * @param {Array} [params.existingAllocations=[]] - Active allocations
 * @returns {Object} Matching results contract
 */
export function runMatching({
  requests = [],
  vehicles = [],
  existingAllocations = [],
}) {
  const allocations = [];
  const updatedRequests = [];
  const unallocatedRequests = [];

  // Deep clone vehicles to track capacity mutations safely
  const updatedVehiclesMap = new Map();
  vehicles.forEach((v) => {
    updatedVehiclesMap.set(v.id, {
      ...v,
      availableSeats: Number(v.availableSeats ?? v.capacity ?? 0),
    });
  });

  // Filter requests that require allocation:
  // Must be 'requested', 'unallocated', 'pending', or reallocating
  const pendingRequests = requests.filter(
    (r) => r.status === 'requested' || r.status === 'unallocated' || r.status === 'pending' || r.isReallocating
  );

  // Sort requests by urgency (High -> Medium -> Low) then by date
  const urgencyWeight = { High: 3, Medium: 2, Low: 1 };
  const sortedRequests = [...pendingRequests].sort((a, b) => {
    const uA = urgencyWeight[a.urgency] || 1;
    const uB = urgencyWeight[b.urgency] || 1;
    if (uB !== uA) return uB - uA;
    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
  });

  // Eligible vehicles filter:
  // Must be verified, not in breakdown, not unavailable/offline, and have seats > 0
  const isVehicleEligible = (veh) => {
    if (!veh) return false;
    if (veh.verified === false) return false; // Strict legal & verification check
    if (veh.status === 'breakdown' || veh.status === 'unavailable' || veh.status === 'offline') return false;
    return (veh.availableSeats || 0) > 0;
  };

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Process matching
  for (const req of sortedRequests) {
    const requiredSeats = Number(req.passengers || 1);

    // Find candidate vehicles with sufficient seats
    const candidates = Array.from(updatedVehiclesMap.values()).filter(
      (veh) => isVehicleEligible(veh) && veh.availableSeats >= requiredSeats
    );

    if (candidates.length === 0) {
      // No vehicle can accommodate this request
      const unallocReq = {
        ...req,
        status: 'unallocated',
        matchedVehicle: null,
        unallocatedReason: 'No verified community vehicle with sufficient capacity available',
      };
      updatedRequests.push(unallocReq);
      unallocatedRequests.push(unallocReq);
      continue;
    }

    // Score candidates based on:
    // 1. Proximity score (0 to 10 points)
    // 2. Capacity fit (tightest fit preferred to preserve large vehicles, 0 to 5 points)
    // 3. Driver rating (0 to 5 points)
    const scoredCandidates = candidates.map((veh) => {
      const proximityScore = calculateProximityScore(req, veh) * 10;
      // Best fit: smaller positive difference between available seats and required seats
      const seatSurplus = veh.availableSeats - requiredSeats;
      const fitScore = Math.max(0, 5 - seatSurplus * 0.5);
      const ratingScore = Number(veh.rating || 4.5);

      const totalScore = proximityScore + fitScore + ratingScore;

      return { vehicle: veh, score: totalScore };
    });

    // Select candidate with highest score
    scoredCandidates.sort((a, b) => b.score - a.score);
    const selectedVehicle = scoredCandidates[0].vehicle;

    // Deduct seats
    selectedVehicle.availableSeats -= requiredSeats;
    if (selectedVehicle.availableSeats === 0) {
      selectedVehicle.status = 'on-trip';
    } else {
      selectedVehicle.status = selectedVehicle.status === 'on-trip' ? 'on-trip' : 'available';
    }
    updatedVehiclesMap.set(selectedVehicle.id, selectedVehicle);

    // Create allocation
    const allocationId = `ALC-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    const newAllocation = {
      id: allocationId,
      requestId: req.id,
      studentId: req.studentId || 'STU-GEN',
      studentName: req.studentName || 'Student Passenger',
      pickupLocation: req.pickupLocation || req.village,
      destinationLocation: req.destinationLocation,
      passengers: requiredSeats,
      vehicleId: selectedVehicle.id,
      driverName: selectedVehicle.driverName,
      driverPhone: selectedVehicle.driverPhone,
      vehicleType: selectedVehicle.vehicleType,
      vehicleNumber: selectedVehicle.vehicleNumber,
      allocatedAt: new Date().toISOString(),
      status: 'active',
      eta: selectedVehicle.eta || '6-9 mins away',
    };
    allocations.push(newAllocation);

    // Update request
    const matchedReq = {
      ...req,
      status: 'matched',
      isReallocating: false,
      matchedVehicle: {
        id: selectedVehicle.id,
        driverName: selectedVehicle.driverName,
        driverPhone: selectedVehicle.driverPhone,
        vehicleType: selectedVehicle.vehicleType,
        vehicleNumber: selectedVehicle.vehicleNumber,
        rating: selectedVehicle.rating,
        totalTrips: selectedVehicle.totalTrips || 140,
        eta: selectedVehicle.eta || '6-9 mins away',
        liveLocation: selectedVehicle.liveLocation || `En route to ${req.pickupLocation}`,
      },
      trackingSteps: Array.isArray(req.trackingSteps)
        ? req.trackingSteps.map((step) => {
            if (step.id === 2) {
              return {
                ...step,
                done: true,
                time: currentTimeStr,
                desc: `Matched with ${selectedVehicle.driverName} (${selectedVehicle.vehicleNumber})`,
              };
            }
            return step;
          })
        : [
            { id: 1, label: 'Ride Requested', done: true, time: currentTimeStr },
            { id: 2, label: 'Community Driver Matched', done: true, time: currentTimeStr, desc: `Matched with ${selectedVehicle.driverName}` },
            { id: 3, label: 'Driver Arrived at Pickup', done: false, time: '--' },
            { id: 4, label: 'En Route to Destination', done: false, time: '--' },
            { id: 5, label: 'Trip Completed', done: false, time: '--' },
          ],
    };
    updatedRequests.push(matchedReq);
  }

  // Include any other non-pending requests in updatedRequests unchanged
  const otherRequests = requests.filter(
    (r) => !pendingRequests.some((p) => p.id === r.id)
  );
  const allFinalRequests = [...updatedRequests, ...otherRequests];

  // Calculate summary metrics
  const studentsAllocated = updatedRequests
    .filter((r) => r.status === 'matched')
    .reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const studentsUnallocated = unallocatedRequests
    .reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const summary = {
    totalRequests: pendingRequests.length,
    allocatedRequests: allocations.length,
    unallocatedRequests: unallocatedRequests.length,
    studentsAllocated,
    studentsUnallocated,
  };

  return {
    allocations,
    updatedRequests: allFinalRequests,
    updatedVehicles: Array.from(updatedVehiclesMap.values()),
    unallocatedRequests,
    summary,
  };
}

export default runMatching;
