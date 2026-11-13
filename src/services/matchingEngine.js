
const normalize = (value) =>
  String(value ?? '').trim().toLowerCase();

const parseTime = (value) => {
  if (!value) return null;

  const match = String(value).match(
    /(?:^|\s)(\d{1,2}):(\d{2})\s*(AM|PM)?/i
  );

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (minutes > 59) return null;

  if (period) {
    if (hours < 1 || hours > 12) return null;

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
};

const getRouteStops = (vehicle) => {
  if (Array.isArray(vehicle.routePoints) && vehicle.routePoints.length > 0) {
    return vehicle.routePoints
      .map((point) => {
        if (typeof point === 'string') return normalize(point);
        return normalize(point?.location || point?.name);
      })
      .filter(Boolean);
  }

  return [
    vehicle.currentLocation || vehicle.baseLocation,
    ...(vehicle.intermediateStops || []),
    vehicle.destination,
  ]
    .filter(Boolean)
    .map(normalize);
};

const checkRoute = (request, vehicle) => {
  const stops = getRouteStops(vehicle);

  if (stops.length < 2) {
    return {
      eligible: false,
      reason: 'Vehicle route information is incomplete',
    };
  }

  const pickup = normalize(request.pickupLocation);
  const destination = normalize(
    request.junction || request.destinationLocation
  );

  if (!pickup || !destination) {
    return {
      eligible: false,
      reason: 'Student pickup or destination is missing',
    };
  }

  const pickupIndex = stops.indexOf(pickup);
  const destinationIndex = stops.indexOf(destination);

  if (pickupIndex === -1 || destinationIndex === -1) {
    return {
      eligible: false,
      reason: 'Pickup or destination is not on the vehicle route',
    };
  }

  if (destinationIndex <= pickupIndex) {
    return {
      eligible: false,
      reason: 'Vehicle route travels in the wrong direction',
    };
  }

  const routeScore =
    destinationIndex === pickupIndex + 1 ? 1 : 0.8;

  return {
    eligible: true,
    score: routeScore,
  };
};

const checkTime = (request, vehicle) => {
  const departure = parseTime(vehicle.departureTime);

  // scheduledTime represents the requested pickup time.
  const requestedPickup = parseTime(
    request.pickupTime || request.scheduledTime
  );

  const travelToPickup = Number(
    vehicle.estimatedTravelMinutesToPickup
  );

  const travelToDestination = Number(
    vehicle.estimatedTravelMinutesToDestination
  );

  if (
    departure === null ||
    requestedPickup === null ||
    !Number.isFinite(travelToPickup) ||
    !Number.isFinite(travelToDestination) ||
    travelToPickup < 0 ||
    travelToDestination < 0
  ) {
    return {
      eligible: false,
      reason: 'Departure time or travel duration is missing',
    };
  }

  const pickupArrival = departure + travelToPickup;

  // Allow a pickup deadline after midnight when appropriate.
  let pickupDeadline = requestedPickup;

  while (pickupDeadline < departure) {
    pickupDeadline += 1440;
  }

  if (pickupArrival > pickupDeadline) {
    return {
      eligible: false,
      reason: 'Vehicle cannot reach the pickup on time',
    };
  }

  const destinationArrival =
    pickupArrival + travelToDestination;

  if (request.arrivalTime) {
    let destinationDeadline = parseTime(request.arrivalTime);

    if (destinationDeadline === null) {
      return {
        eligible: false,
        reason: 'Student arrival deadline is invalid',
      };
    }

    while (destinationDeadline < departure) {
      destinationDeadline += 1440;
    }

    if (destinationArrival > destinationDeadline) {
      return {
        eligible: false,
        reason: 'Vehicle cannot reach the destination before the deadline',
      };
    }
  }

  const waitingMinutes = pickupDeadline - pickupArrival;

  return {
    eligible: true,
    score: Math.max(0, 1 - waitingMinutes / 120),
    departureScore: Math.max(
      0,
      1 - Math.abs(departure - pickupDeadline) / 180
    ),
  };
};

const checkVehicle = (request, vehicle) => {
  if (vehicle.verified !== true) {
    return {
      eligible: false,
      reason: 'Vehicle is not verified',
    };
  }

  if (vehicle.legalEligibility !== true) {
    return {
      eligible: false,
      reason: 'Legal passenger eligibility is not confirmed',
    };
  }

  if (vehicle.willingnessConfirmed !== true) {
    return {
      eligible: false,
      reason: 'Owner willingness is not confirmed',
    };
  }

  if (vehicle.status !== 'available') {
    return {
      eligible: false,
      reason: 'Vehicle is not available',
    };
  }

  const passengers = Number(request.passengers ?? 1);
  const seats = Number(vehicle.availableSeats);

  if (!Number.isInteger(passengers) || passengers < 1) {
    return {
      eligible: false,
      reason: 'Invalid passenger count',
    };
  }

  if (!Number.isInteger(seats) || seats < passengers) {
    return {
      eligible: false,
      reason: 'Insufficient available seats',
    };
  }

  const route = checkRoute(request, vehicle);

  if (!route.eligible) return route;

  const time = checkTime(request, vehicle);

  if (!time.eligible) return time;

  // Prefer vehicles that use their available seats efficiently.
  const capacityScore = passengers / seats;

  // Weighted deterministic matching score.
  const score =
    0.4 * route.score +
    0.3 * time.score +
    0.2 * capacityScore +
    0.1 * time.departureScore;

  return {
    eligible: true,
    score: Number(score.toFixed(4)),
    scoreBreakdown: {
      route: Number(route.score.toFixed(2)),
      timing: Number(time.score.toFixed(2)),
      capacity: Number(capacityScore.toFixed(2)),
      departure: Number(time.departureScore.toFixed(2)),
    },
    explanation: [
      'Vehicle is verified.',
      'Legal passenger eligibility is confirmed.',
      'Owner has confirmed willingness.',
      'Vehicle route is compatible with the requested journey.',
      'Available seats satisfy the passenger requirement.',
      'Travel timing satisfies the pickup and arrival constraints.',
    ],
  };
};

export function runMatching({
  requests = [],
  vehicles = [],
  existingAllocations = [],
} = {}) {
  if (!Array.isArray(requests) || !Array.isArray(vehicles)) {
    throw new TypeError('Requests and vehicles must be arrays');
  }

  if (!Array.isArray(existingAllocations)) {
    throw new TypeError('Existing allocations must be an array');
  }

  const updatedVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
  }));

  const updatedRequests = requests.map((request) => ({
    ...request,
  }));

  const allocations = [];
  const unallocatedRequests = [];

  // Protect requests that already have an allocation.
  const alreadyAllocated = new Set(
    existingAllocations
      .map((allocation) => allocation.requestId)
      .filter(Boolean)
  );

  const pendingRequests = updatedRequests
    .filter(
      (request) =>
        ['requested', 'pending'].includes(request.status) &&
        !alreadyAllocated.has(request.id)
    )
    .sort((a, b) => {
      const priority = { High: 3, Medium: 2, Low: 1 };

      const priorityDifference =
        (priority[b.urgency] || 0) -
        (priority[a.urgency] || 0);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return String(a.id).localeCompare(String(b.id));
    });

  for (const request of pendingRequests) {
    if (!request.id) {
      unallocatedRequests.push({
        ...request,
        reason: 'Request ID is missing',
      });
      continue;
    }

    const candidates = updatedVehicles
      .map((vehicle) => ({
        vehicle,
        result: checkVehicle(request, vehicle),
      }))
      .filter((candidate) => candidate.result.eligible)
      .sort(
        (a, b) =>
          b.result.score - a.result.score ||
          String(a.vehicle.id).localeCompare(String(b.vehicle.id))
      );

    const best = candidates[0];

    if (!best) {
      unallocatedRequests.push({
        ...request,
        reason: 'No vehicle satisfies all matching requirements',
      });
      continue;
    }

    const vehicle = best.vehicle;
    const passengers = Number(request.passengers ?? 1);

    // Reserve seats without modifying the original input.
    vehicle.availableSeats -= passengers;

    if (vehicle.availableSeats === 0) {
      vehicle.status = 'on-trip';
    }

    const allocation = {
      id: `ALLOC-${request.id}-${vehicle.id}`,
      requestId: request.id,
      vehicleId: vehicle.id,
      passengerCount: passengers,
      score: best.result.score,
      scoreBreakdown: best.result.scoreBreakdown,
      explanation: best.result.explanation,
    };

    allocations.push(allocation);
    alreadyAllocated.add(request.id);

    const requestIndex = updatedRequests.findIndex(
      (item) => item.id === request.id
    );

    updatedRequests[requestIndex] = {
      ...request,
      status: 'matched',
      assignedVehicleId: vehicle.id,
      matchedVehicle: {
        id: vehicle.id,
        driverName: vehicle.driverName || vehicle.ownerName,
        driverPhone: vehicle.driverPhone || vehicle.contactNumber,
        vehicleType: vehicle.vehicleType,
        vehicleNumber:
          vehicle.vehicleNumber || vehicle.registrationNumber,
      },
    };
  }

  const studentsAllocated = allocations.reduce(
    (total, allocation) =>
      total + allocation.passengerCount,
    0
  );

  const studentsUnallocated = unallocatedRequests.reduce(
    (total, request) =>
      total + Number(request.passengers ?? 1),
    0
  );

  return {
    allocations,
    updatedRequests,
    updatedVehicles,
    unallocatedRequests,
    summary: {
      totalRequests: pendingRequests.length,
      allocatedRequests: allocations.length,
      unallocatedRequests: unallocatedRequests.length,
      studentsAllocated,
      studentsUnallocated,
    },
  };
}
