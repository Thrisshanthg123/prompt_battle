/**
 * Verification test script for SANCHAARI Admin Dashboard & Disruption Management
 * Tests all 6 scenarios from Section 16 of the specifications.
 */

import { runMatching } from './src/services/matchingEngine.js';
import { handleVehicleBreakdown, resolveVehicleBreakdown } from './src/services/disruptionService.js';
import {
  calculateDashboardKPIs,
  getDemandOverview,
  getVillageDemandData,
  getPeakPeriodData,
  getRouteCapacityData,
  getDemandRecommendations,
  getDemandForecastData,
} from './src/services/adminService.js';
import {
  INITIAL_JOURNEYS,
  INITIAL_VEHICLES,
  INITIAL_DISRUPTIONS,
  INITIAL_ALLOCATIONS,
} from './src/context/mockData.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('SANCHAARI - TEST SUITE: SCENARIOS 1 TO 6');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // Scenario 1 – Normal Operation & Matching Engine
  // -------------------------------------------------------------
  console.log('--- Scenario 1: Normal Operation & AI Matching Engine ---');
  const testRequest = {
    id: 'REQ-TEST-001',
    studentId: 'STU-001',
    studentName: 'Test Student',
    village: 'Kunnamangalam',
    pickupLocation: 'Kunnamangalam Junction',
    destinationLocation: 'GECK Campus Main Gate',
    passengers: 2,
    urgency: 'High',
    status: 'requested',
    createdAt: new Date().toISOString(),
  };

  const testVehicles = [
    {
      id: 'VEH-TEST-01',
      driverName: 'Driver One',
      vehicleNumber: 'KL-11-AA-1111',
      vehicleType: 'Auto',
      capacity: 3,
      availableSeats: 3,
      status: 'available',
      verified: true,
      baseLocation: 'Kunnamangalam',
      rating: 4.8,
    },
  ];

  const matchResult = runMatching({
    requests: [testRequest],
    vehicles: testVehicles,
  });

  assert(matchResult.summary.totalRequests === 1, 'Matching input totalRequests is 1');
  assert(matchResult.summary.allocatedRequests === 1, 'Matching allocatedRequests is 1');
  assert(matchResult.allocations.length === 1, 'Allocations created is 1');
  assert(matchResult.allocations[0].vehicleId === 'VEH-TEST-01', 'Assigned to correct vehicle');
  assert(matchResult.updatedVehicles[0].availableSeats === 1, 'Available seats correctly reduced from 3 to 1');
  assert(matchResult.updatedRequests[0].status === 'matched', 'Request status updated to matched');

  // -------------------------------------------------------------
  // Scenario 2 – Vehicle Breakdown & Automatic Reallocation
  // -------------------------------------------------------------
  console.log('\n--- Scenario 2: Vehicle Breakdown & Automatic Reallocation ---');
  // Use INITIAL_VEHICLES and INITIAL_JOURNEYS
  // VEH-01 has 2 students allocated (Aarav JRN-101 and Fathima JRN-103)
  const breakdownResult = await handleVehicleBreakdown('VEH-01', {
    requests: INITIAL_JOURNEYS,
    vehicles: INITIAL_VEHICLES,
    allocations: INITIAL_ALLOCATIONS,
  });

  assert(breakdownResult.success === true, 'Breakdown workflow executed successfully');
  assert(breakdownResult.brokenVehicle.status === 'breakdown', 'Failed vehicle marked as breakdown');
  assert(breakdownResult.brokenVehicle.availableSeats === 0, 'Broken vehicle available seats set to 0');
  assert(breakdownResult.affectedRequests.length === 2, 'Identified both affected requests for VEH-01');
  assert(breakdownResult.beforeSnapshot.affectedStudents === 3, 'Affected students count is 3 (2 pax + 1 pax)');
  assert(breakdownResult.summary.studentsReassigned > 0, 'Students successfully reassigned to alternative vehicles');
  assert(breakdownResult.disruptionRecord !== undefined, 'Disruption audit record generated');
  assert(breakdownResult.activityLog !== undefined, 'Activity log entry created');

  // Test Repair / Re-enable
  const repairedVehicles = resolveVehicleBreakdown('VEH-01', breakdownResult.updatedVehicles);
  const repairedVeh = repairedVehicles.find((v) => v.id === 'VEH-01');
  assert(repairedVeh.status === 'available', 'Vehicle repaired and marked available');
  assert(repairedVeh.availableSeats === repairedVeh.capacity, 'Vehicle capacity restored');

  // -------------------------------------------------------------
  // Scenario 3 – Insufficient Capacity (Zero Stranded Students Guarantee)
  // -------------------------------------------------------------
  console.log('\n--- Scenario 3: Insufficient Capacity Handling ---');
  // 10 students needing rides, but only 1 seat available across entire fleet
  const largeRequest = {
    id: 'REQ-LARGE-001',
    studentName: 'Large Group',
    passengers: 10,
    status: 'requested',
    village: 'Mavoor',
    pickupLocation: 'Mavoor',
    destinationLocation: 'GECK',
  };

  const tightFleet = [
    {
      id: 'VEH-TIGHT-01',
      driverName: 'Small Auto',
      vehicleNumber: 'KL-11-T-01',
      capacity: 3,
      availableSeats: 2, // only 2 seats available
      status: 'available',
      verified: true,
      baseLocation: 'Mavoor',
    },
  ];

  const tightMatch = runMatching({
    requests: [largeRequest],
    vehicles: tightFleet,
  });

  assert(tightMatch.summary.allocatedRequests === 0, 'Does not force partial or invalid allocation');
  assert(tightMatch.summary.unallocatedRequests === 1, 'Marks request as unallocated');
  assert(tightMatch.unallocatedRequests[0].id === 'REQ-LARGE-001', 'Identifies unallocated request ID');
  assert(tightMatch.updatedVehicles[0].availableSeats === 2, 'Leaves vehicle capacity unchanged');

  // Test unverified vehicle exclusion (must NEVER assign unverified vehicle)
  const unverifiedFleet = [
    {
      id: 'VEH-UNVERIFIED',
      driverName: 'Illegal Van',
      capacity: 10,
      availableSeats: 10,
      status: 'available',
      verified: false, // Ineligible!
    },
  ];

  const unverifiedMatch = runMatching({
    requests: [largeRequest],
    vehicles: unverifiedFleet,
  });
  assert(unverifiedMatch.summary.allocatedRequests === 0, 'Unverified vehicle strictly excluded from matching');

  // -------------------------------------------------------------
  // Scenario 4 – Predictive Analytics Integration
  // -------------------------------------------------------------
  console.log('\n--- Scenario 4: Predictive Analytics Integration ---');
  const [demandOverview, villageDemand, peakPeriods, routeCaps, aiRecs, forecast] = await Promise.all([
    getDemandOverview(),
    getVillageDemandData(),
    getPeakPeriodData(),
    getRouteCapacityData(),
    getDemandRecommendations(),
    getDemandForecastData(),
  ]);

  assert(demandOverview.data !== undefined, 'Demand overview returned');
  assert(villageDemand.data.length > 0, 'Village demand statistics populated');
  assert(peakPeriods.data.length > 0, 'Peak travel period curve populated');
  assert(routeCaps.data.length > 0, 'Route capacity deficits populated');
  assert(aiRecs.data.length > 0, 'AI recommendations with confidence scores returned');
  assert(forecast.data.length === 7, 'Weekly demand forecast populated for 7 days');
  assert(demandOverview.isSynthetic === true || demandOverview.isSynthetic === false, 'Explicitly flags data provenance (isSynthetic)');

  // -------------------------------------------------------------
  // Scenario 5 – Dynamic KPI Calculation & Shared State
  // -------------------------------------------------------------
  console.log('\n--- Scenario 5: Dynamic KPI Calculation ---');
  const kpis = calculateDashboardKPIs({
    requests: INITIAL_JOURNEYS,
    vehicles: INITIAL_VEHICLES,
    disruptions: INITIAL_DISRUPTIONS,
    allocations: INITIAL_ALLOCATIONS,
  });

  assert(kpis.totalRequests === INITIAL_JOURNEYS.length, `Total requests (${kpis.totalRequests}) matches data`);
  assert(kpis.totalRegisteredVehicles === INITIAL_VEHICLES.length, `Registered vehicles (${kpis.totalRegisteredVehicles}) matches data`);
  assert(kpis.activeDisruptions === INITIAL_DISRUPTIONS.filter(d => d.status === 'Active').length, 'Active disruptions correctly counted');
  assert(kpis.allocationRate > 0 && kpis.allocationRate <= 100, `Allocation rate is dynamic: ${kpis.allocationRate}%`);

  // -------------------------------------------------------------
  // Scenario 6 – Error Handling & Edge Cases
  // -------------------------------------------------------------
  console.log('\n--- Scenario 6: Error Handling & Resilience ---');
  try {
    await handleVehicleBreakdown('NON_EXISTENT_VEHICLE_ID', {
      requests: [],
      vehicles: [],
    });
    assert(false, 'Should throw error when vehicle ID does not exist');
  } catch (err) {
    assert(true, `Gracefully caught non-existent vehicle error: "${err.message}"`);
  }

  // Matching with empty inputs
  const emptyMatch = runMatching({});
  assert(emptyMatch.summary.totalRequests === 0, 'Handles empty requests array safely');

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passedTests} OF ${totalTests} ASSERTIONS PASSED.`);
  console.log('================================================================');

  if (passedTests === totalTests) {
    console.log('ALL SCENARIOS VALIDATED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
