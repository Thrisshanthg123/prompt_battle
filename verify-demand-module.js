/**
 * Test Suite: SANCHAARI AI-Powered Predictive Demand Analysis Module
 * Validates all requirements from Section 15 of the specification.
 */

import {
  fetchDemandOverview,
  fetchVillageDemand,
  fetchPeakPeriods,
  fetchRouteCapacities,
  fetchAIRecommendations,
  fetchDemandForecast,
  invalidateDemandCache,
} from './src/services/demandAnalyticsService.js';

import {
  getDemandClassificationBadge,
  getRecommendationPriorityBadge,
  getRouteStatusBadge,
  calculateSeatUtilization,
  filterVillages,
} from './src/utils/demandHelpers.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

async function runDemandTests() {
  console.log('================================================================');
  console.log('SANCHAARI – PREDICTIVE DEMAND ANALYSIS MODULE TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // Test 1: Demand Overview API & KPI Metrics
  // -------------------------------------------------------------
  console.log('--- 1. Demand Overview & Dynamic KPIs ---');
  const overviewRes = await fetchDemandOverview({ dateRange: '7d' });
  assert(overviewRes !== null && typeof overviewRes === 'object', 'Overview response is valid object');
  assert(overviewRes.data.totalTransportRequests > 0, `Total requests populated: ${overviewRes.data.totalTransportRequests}`);
  assert(overviewRes.data.averageDailyDemand > 0, `Average daily demand populated: ${overviewRes.data.averageDailyDemand}`);
  assert(overviewRes.data.predictedFutureDemand > 0, `Predicted future demand populated: ${overviewRes.data.predictedFutureDemand}`);
  assert(overviewRes.data.villagesWithHighDemand > 0, `High demand villages count: ${overviewRes.data.villagesWithHighDemand}`);
  assert(overviewRes.data.routesWithCapacityShortage > 0, `Routes with capacity shortage count: ${overviewRes.data.routesWithCapacityShortage}`);
  assert(overviewRes.isSynthetic === true, 'Data provenance correctly flags synthetic demo status when backend is offline');

  // -------------------------------------------------------------
  // Test 2: Village Demand Analysis & Classification
  // -------------------------------------------------------------
  console.log('\n--- 2. Village-Wise Demand Analysis & Classifications ---');
  const villagesRes = await fetchVillageDemand({ dateRange: '7d' });
  const villages = villagesRes.data;
  assert(Array.isArray(villages) && villages.length >= 7, `Returned ${villages.length} rural villages`);

  // Verify village fields
  const sampleVillage = villages[0];
  assert(sampleVillage.village !== undefined, 'Village has name');
  assert(sampleVillage.totalRequests > 0, 'Village has totalRequests');
  assert(sampleVillage.avgDailyDemand > 0, 'Village has avgDailyDemand');
  assert(sampleVillage.allocatedStudents >= 0, 'Village has allocatedStudents');
  assert(sampleVillage.unallocatedStudents >= 0, 'Village has unallocatedStudents');
  assert(
    ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(sampleVillage.classification),
    `Village classification is valid enum: ${sampleVillage.classification}`
  );

  // Test classification badge helper
  const criticalBadge = getDemandClassificationBadge('CRITICAL');
  assert(criticalBadge.label === 'CRITICAL' && criticalBadge.badgeClass.includes('rose'), 'Critical badge has rose styling');

  const lowBadge = getDemandClassificationBadge('LOW');
  assert(lowBadge.label === 'LOW' && lowBadge.badgeClass.includes('emerald'), 'Low badge has emerald styling');

  // Test filtering by village
  const filteredKunnamangalam = filterVillages(villages, 'Kunnamangalam', '');
  assert(filteredKunnamangalam.length === 1, 'Filter by village name returns exact match');
  assert(filteredKunnamangalam[0].village.includes('Kunnamangalam'), 'Filtered village is Kunnamangalam Hub');

  // -------------------------------------------------------------
  // Test 3: Peak Travel Demand Prediction & Time Intervals
  // -------------------------------------------------------------
  console.log('\n--- 3. Peak Travel Demand Prediction & Intervals ---');
  const peakRes = await fetchPeakPeriods({ dateRange: '7d' });
  const peakData = peakRes.data;
  assert(Array.isArray(peakData) && peakData.length >= 6, `Returned ${peakData.length} time intervals`);

  // Verify required intervals from Section 6
  const intervals = peakData.map((p) => p.timeSlot);
  assert(intervals.some((i) => i.includes('6 AM')), 'Includes 6 AM - 7 AM interval');
  assert(intervals.some((i) => i.includes('7 AM')), 'Includes 7 AM - 8 AM interval');
  assert(intervals.some((i) => i.includes('8 AM')), 'Includes 8 AM - 9 AM interval');
  assert(intervals.some((i) => i.includes('9 AM')), 'Includes 9 AM - 10 AM interval');
  assert(intervals.some((i) => i.includes('12 PM')), 'Includes Afternoon period');
  assert(intervals.some((i) => i.includes('4:30 PM') || i.includes('5:30 PM')), 'Includes Evening period');

  // Verify busiest period calculation
  const busiest = [...peakData].sort((a, b) => b.predictedDemand - a.predictedDemand)[0];
  assert(busiest.isPeak === true, `Busiest period correctly flagged as peak: ${busiest.period}`);
  assert(busiest.predictedDemand > busiest.availableCapacity, 'Busiest peak detects seat shortage');

  // -------------------------------------------------------------
  // Test 4: Route Capacity Analysis & Legal Fleet Counts
  // -------------------------------------------------------------
  console.log('\n--- 4. Route Demand vs Legal Vehicle Capacity ---');
  const routeRes = await fetchRouteCapacities({ dateRange: '7d' });
  const routes = routeRes.data;
  assert(Array.isArray(routes) && routes.length >= 5, `Returned ${routes.length} transit routes`);

  const sampleRoute = routes[0];
  assert(sampleRoute.route !== undefined, 'Route has name');
  assert(sampleRoute.studentDemand > 0, 'Route has studentDemand');
  assert(sampleRoute.availableSeats > 0, 'Route has availableSeats');
  assert(sampleRoute.capacityShortage >= 0, 'Route has capacityShortage');
  assert(sampleRoute.seatUtilization >= 0, 'Route has seatUtilization');

  // Test recurring shortage identification
  const recurringRoutes = routes.filter((r) => r.recurringShortage);
  assert(recurringRoutes.length > 0, `Identified ${recurringRoutes.length} recurring shortage routes`);

  // Test seat utilization math helper
  const util = calculateSeatUtilization(24, 25);
  assert(util === 96, `Seat utilization calculation correct: 24/25 = ${util}%`);

  const routeBadge = getRouteStatusBadge('CRITICAL_DEFICIT', 16);
  assert(routeBadge.label === 'Critical Shortage', 'Route badge flags critical shortage');

  // -------------------------------------------------------------
  // Test 5: AI Transport Recommendations
  // -------------------------------------------------------------
  console.log('\n--- 5. AI Transport Recommendations ---');
  const recRes = await fetchAIRecommendations({});
  const recs = recRes.data;
  assert(Array.isArray(recs) && recs.length >= 4, `Returned ${recs.length} actionable AI recommendations`);

  const recPriorities = new Set(recs.map((r) => r.priority));
  assert(recPriorities.has('CRITICAL'), 'Contains CRITICAL recommendations');
  assert(recPriorities.has('HIGH'), 'Contains HIGH recommendations');
  assert(recPriorities.has('MEDIUM'), 'Contains MEDIUM recommendations');

  const firstRec = recs[0];
  assert(firstRec.problem !== undefined, 'Recommendation identifies concrete problem');
  assert(firstRec.supportingData !== undefined, 'Recommendation provides supporting numerical data');
  assert(firstRec.supportingData.seatShortage > 0, `Supporting data specifies seat shortage: ${firstRec.supportingData.seatShortage}`);
  assert(firstRec.recommendedAction !== undefined, 'Recommendation contains specific dispatch action');
  assert(firstRec.relevantTimePeriod !== undefined, 'Recommendation specifies relevant time period');
  assert(firstRec.confidenceScore >= 80, `Recommendation has high confidence score: ${firstRec.confidenceScore}%`);

  const prioBadge = getRecommendationPriorityBadge('CRITICAL');
  assert(prioBadge.badgeClass.includes('rose'), 'Priority badge uses rose styling for CRITICAL');

  // -------------------------------------------------------------
  // Test 6: Historical vs Predicted Forecast Horizons
  // -------------------------------------------------------------
  console.log('\n--- 6. Multi-Horizon Demand Forecasting ---');
  const [fc1d, fc7d, fc30d] = await Promise.all([
    fetchDemandForecast({ horizon: '1d' }),
    fetchDemandForecast({ horizon: '7d' }),
    fetchDemandForecast({ horizon: '30d' }),
  ]);

  assert(fc1d.data.length >= 8, `1-day horizon has ${fc1d.data.length} hourly projections`);
  assert(fc7d.data.length === 7, `7-day horizon has ${fc7d.data.length} daily projections`);
  assert(fc30d.data.length === 4, `30-day horizon has ${fc30d.data.length} weekly projections`);

  // Verify confidence interval fields
  const sampleForecastPoint = fc7d.data[0];
  assert(sampleForecastPoint.historical !== undefined, 'Forecast point includes historical demand');
  assert(sampleForecastPoint.current !== undefined, 'Forecast point includes current demand');
  assert(sampleForecastPoint.forecast !== undefined, 'Forecast point includes forecast');
  assert(sampleForecastPoint.upper >= sampleForecastPoint.forecast, 'Upper bound is >= forecast');
  assert(sampleForecastPoint.lower <= sampleForecastPoint.forecast, 'Lower bound is <= forecast');

  // -------------------------------------------------------------
  // Test 7: Cache Invalidation & Error Handling
  // -------------------------------------------------------------
  console.log('\n--- 7. Caching & Resilience ---');
  invalidateDemandCache();
  const refreshedOverview = await fetchDemandOverview({ dateRange: 'today' });
  assert(refreshedOverview.data !== undefined, 'Successfully fetched fresh data after cache invalidation');

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} OF ${total} TESTS PASSED.`);
  console.log('================================================================');

  if (passed === total) {
    console.log('ALL PREDICTIVE DEMAND TESTS COMPLETED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runDemandTests();
