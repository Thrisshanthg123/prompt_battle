
import assert from 'node:assert/strict';
import { runMatching } from './matchingEngine.js';

const createVehicle = (overrides = {}) => ({
  id: 'VEH-001',
  ownerName: 'Ramesh Kumar',
  driverName: 'Ramesh Kumar',
  contactNumber: '9876543210',
  vehicleType: 'car',
  registrationNumber: 'KA-01-AB-1234',

  currentLocation: 'Village A',
  destination: 'Junction X',
  routePoints: ['Village A', 'Junction X'],

  departureTime: '07:30 AM',
  estimatedTravelMinutesToPickup: 15,
  estimatedTravelMinutesToDestination: 35,

  passengerCapacity: 4,
  availableSeats: 4,

  verified: true,
  legalEligibility: true,
  willingnessConfirmed: true,
  status: 'available',

  ...overrides,
});

const createRequest = (overrides = {}) => ({
  id: 'REQ-001',
  studentName: 'Rahul',
  pickupLocation: 'Village A',
  destinationLocation: 'College',
  junction: 'Junction X',
  scheduledTime: '08:00 AM',
  arrivalTime: '09:00 AM',
  passengers: 2,
  urgency: 'High',
  status: 'requested',

  ...overrides,
});

let passed = 0;

const test = (name, callback) => {
  try {
    callback();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
};

// TEST 1: Eligible vehicle should be matched.
test('Matches an eligible vehicle', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle()],
  });

  assert.equal(result.allocations.length, 1);
  assert.equal(result.updatedRequests[0].status, 'matched');
  assert.equal(
    result.updatedRequests[0].assignedVehicleId,
    'VEH-001'
  );
  assert.equal(result.updatedVehicles[0].availableSeats, 2);
});

// TEST 2: Unverified vehicles must be rejected.
test('Rejects unverified vehicles', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle({ verified: false })],
  });

  assert.equal(result.allocations.length, 0);
  assert.equal(result.unallocatedRequests.length, 1);
});

// TEST 3: Legally ineligible vehicles must be rejected.
test('Rejects legally ineligible vehicles', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle({ legalEligibility: false })],
  });

  assert.equal(result.allocations.length, 0);
});

// TEST 4: Owner willingness must be confirmed.
test('Rejects vehicles without owner willingness', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle({ willingnessConfirmed: false })],
  });

  assert.equal(result.allocations.length, 0);
});

// TEST 5: Insufficient seats must be rejected.
test('Rejects vehicles with insufficient seats', () => {
  const result = runMatching({
    requests: [createRequest({ passengers: 3 })],
    vehicles: [createVehicle({ availableSeats: 2 })],
  });

  assert.equal(result.allocations.length, 0);
});

// TEST 6: Incompatible routes must be rejected.
test('Rejects incompatible routes', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [
      createVehicle({
        routePoints: ['Village B', 'Junction Y'],
      }),
    ],
  });

  assert.equal(result.allocations.length, 0);
});

// TEST 7: Late vehicles must be rejected.
test('Rejects vehicles that cannot reach pickup on time', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [
      createVehicle({
        departureTime: '08:00 AM',
        estimatedTravelMinutesToPickup: 30,
      }),
    ],
  });

  assert.equal(result.allocations.length, 0);
});

// TEST 8: Existing allocations must not be duplicated.
test('Skips requests that already have allocations', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle()],
    existingAllocations: [
      {
        id: 'ALLOC-OLD',
        requestId: 'REQ-001',
        vehicleId: 'VEH-001',
        passengerCount: 2,
      },
    ],
  });

  assert.equal(result.allocations.length, 0);
  assert.equal(result.unallocatedRequests.length, 0);
  assert.equal(result.summary.totalRequests, 0);
});

// TEST 9: Vehicle capacity must never be exceeded.
test('Never allocates more passengers than available seats', () => {
  const result = runMatching({
    requests: [
      createRequest({ id: 'REQ-001', passengers: 2 }),
      createRequest({ id: 'REQ-002', passengers: 2 }),
    ],
    vehicles: [
      createVehicle({ availableSeats: 3 }),
    ],
  });

  assert.equal(result.allocations.length, 1);
  assert.equal(result.unallocatedRequests.length, 1);
  assert.equal(result.updatedVehicles[0].availableSeats, 1);
});

// TEST 10: Original input data must remain unchanged.
test('Does not mutate original vehicle data', () => {
  const vehicle = createVehicle();
  const originalSeats = vehicle.availableSeats;

  runMatching({
    requests: [createRequest()],
    vehicles: [vehicle],
  });

  assert.equal(vehicle.availableSeats, originalSeats);
});

// TEST 11: Summary must report allocation counts correctly.
test('Returns correct allocation summary', () => {
  const result = runMatching({
    requests: [createRequest()],
    vehicles: [createVehicle()],
  });

  assert.equal(result.summary.totalRequests, 1);
  assert.equal(result.summary.allocatedRequests, 1);
  assert.equal(result.summary.unallocatedRequests, 0);
  assert.equal(result.summary.studentsAllocated, 2);
  assert.equal(result.summary.studentsUnallocated, 0);
});

console.log(`\n${passed}/11 tests passed.`);
