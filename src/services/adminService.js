/**
 * ============================================================================
 * SANCHAARI - MEMBER 3 ADMIN SERVICE & PREDICTIVE DEMAND INTEGRATION
 * ============================================================================
 * 
 * File: src/services/adminService.js
 * Assigned Owner: MEMBER 3 (Admin Dashboard & Analytics Integration)
 * Integrates: Member 4's Predictive Demand & Supabase Analytics APIs
 * 
 * Expected Endpoints:
 * - GET /api/analytics/demand/overview
 * - GET /api/analytics/demand/villages
 * - GET /api/analytics/demand/peak-periods
 * - GET /api/analytics/demand/routes
 * - GET /api/analytics/demand/recommendations
 * - GET /api/analytics/demand/forecast
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:5000';

/**
 * Generic fetcher with timeout and safe fallback to synthetic demo data.
 */
async function fetchWithFallback(endpoint, fallbackGenerator) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        data,
        isSynthetic: false,
        source: 'Live Member 4 API',
        lastUpdated: new Date().toLocaleTimeString(),
      };
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (err) {
    // API is offline or not implemented yet; provide clearly marked synthetic demo dataset
    return {
      data: fallbackGenerator(),
      isSynthetic: true,
      source: 'Synthetic Demo Model (Member 4 Backend Offline)',
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }
}

/**
 * 1. Demand Intelligence - Overview
 */
export async function getDemandOverview() {
  return fetchWithFallback('/api/analytics/demand/overview', () => ({
    totalDemandTripsForecast: 284,
    underservedCorridors: 3,
    peakCongestionHour: '08:00 AM - 09:15 AM',
    modelConfidence: '91.4%',
    predictedDriverDeficit: 8,
    activeHotspots: ['Mavoor Road', 'Kunnamangalam Hub', 'Karanthur Junction'],
  }));
}

/**
 * 2. Village-wise Transport Demand
 */
export async function getVillageDemandData() {
  return fetchWithFallback('/api/analytics/demand/villages', () => [
    { village: 'Kunnamangalam', currentRequests: 42, predictedDemand: 58, vehicleCapacity: 35, deficit: 23 },
    { village: 'Mavoor Road', currentRequests: 36, predictedDemand: 48, vehicleCapacity: 28, deficit: 20 },
    { village: 'Karanthur', currentRequests: 28, predictedDemand: 34, vehicleCapacity: 30, deficit: 4 },
    { village: 'Kuttikkattoor', currentRequests: 22, predictedDemand: 31, vehicleCapacity: 18, deficit: 13 },
    { village: 'Chathamangalam', currentRequests: 19, predictedDemand: 26, vehicleCapacity: 22, deficit: 4 },
    { village: 'Balussery Ghat', currentRequests: 17, predictedDemand: 29, vehicleCapacity: 12, deficit: 17 },
    { village: 'Koduvally', currentRequests: 14, predictedDemand: 20, vehicleCapacity: 15, deficit: 5 },
  ]);
}

/**
 * 3. Peak Travel Periods
 */
export async function getPeakPeriodData() {
  return fetchWithFallback('/api/analytics/demand/peak-periods', () => [
    { time: '06:30 AM', studentDemand: 12, vehicleCapacity: 20, surgeMultiplier: 1.0 },
    { time: '07:15 AM', studentDemand: 38, vehicleCapacity: 32, surgeMultiplier: 1.3 },
    { time: '08:00 AM', studentDemand: 74, vehicleCapacity: 45, surgeMultiplier: 1.8 },
    { time: '08:45 AM', studentDemand: 92, vehicleCapacity: 50, surgeMultiplier: 2.1 },
    { time: '09:30 AM', studentDemand: 46, vehicleCapacity: 48, surgeMultiplier: 1.2 },
    { time: '12:30 PM', studentDemand: 18, vehicleCapacity: 35, surgeMultiplier: 1.0 },
    { time: '03:45 PM', studentDemand: 41, vehicleCapacity: 38, surgeMultiplier: 1.2 },
    { time: '04:30 PM', studentDemand: 82, vehicleCapacity: 44, surgeMultiplier: 1.9 },
    { time: '05:15 PM', studentDemand: 68, vehicleCapacity: 40, surgeMultiplier: 1.6 },
    { time: '06:00 PM', studentDemand: 29, vehicleCapacity: 35, surgeMultiplier: 1.0 },
  ]);
}

/**
 * 4. Route Capacity vs Demand Comparison
 */
export async function getRouteCapacityData() {
  return fetchWithFallback('/api/analytics/demand/routes', () => [
    { route: 'Mavoor -> GECK Gate', registeredVehicles: 8, seatCapacity: 32, peakDemand: 48, risk: 'High' },
    { route: 'Kunnamangalam -> REC', registeredVehicles: 12, seatCapacity: 54, peakDemand: 60, risk: 'Medium' },
    { route: 'Karanthur -> Medical College', registeredVehicles: 6, seatCapacity: 26, peakDemand: 24, risk: 'Low' },
    { route: 'Balussery -> City Stand', registeredVehicles: 4, seatCapacity: 18, peakDemand: 34, risk: 'Critical' },
    { route: 'Palayam -> Campus Shuttle', registeredVehicles: 7, seatCapacity: 30, peakDemand: 36, risk: 'Medium' },
  ]);
}

/**
 * 5. AI Recommendations
 */
export async function getDemandRecommendations() {
  return fetchWithFallback('/api/analytics/demand/recommendations', () => [
    {
      id: 'REC-01',
      title: 'Mavoor Corridor Early Capacity Surge',
      severity: 'Critical',
      action: 'Incentivize 4 additional auto-rickshaws to stage at Mavoor Road Hub between 07:45 - 08:45 AM.',
      expectedBenefit: 'Avoid ~28 student trip cancellations and minimize 35-min bus wait times.',
      confidence: 94,
    },
    {
      id: 'REC-02',
      title: 'Balussery Ghat Route Pre-emptive Pooling',
      severity: 'High',
      action: 'Convert Route 108 individual requests into 7-seater community van carpools from Balussery bus stand.',
      expectedBenefit: 'Saves 35% fuel and guarantees 100% seat occupancy before public bus departure.',
      confidence: 89,
    },
    {
      id: 'REC-03',
      title: 'Post-4 PM Evening Last-Mile Frequency Extension',
      severity: 'Medium',
      action: 'Schedule 3 parent carpools around GECK Campus Gate between 04:30 PM - 05:30 PM.',
      expectedBenefit: 'Resolves recurring last-mile transit gap for late lab students.',
      confidence: 86,
    },
  ]);
}

/**
 * 6. Historical vs Forecast Demand
 */
export async function getDemandForecastData() {
  return fetchWithFallback('/api/analytics/demand/forecast', () => [
    { day: 'Mon', historical: 145, forecast: 160, confidenceUpper: 172, confidenceLower: 148 },
    { day: 'Tue', historical: 162, forecast: 168, confidenceUpper: 180, confidenceLower: 156 },
    { day: 'Wed', historical: 158, forecast: 175, confidenceUpper: 188, confidenceLower: 162 },
    { day: 'Thu', historical: 170, forecast: 182, confidenceUpper: 195, confidenceLower: 169 },
    { day: 'Fri', historical: 195, forecast: 215, confidenceUpper: 232, confidenceLower: 198 },
    { day: 'Sat', historical: 78, forecast: 85, confidenceUpper: 95, confidenceLower: 75 },
    { day: 'Sun', historical: 32, forecast: 38, confidenceUpper: 45, confidenceLower: 30 },
  ]);
}

/**
 * Computes live Admin KPI Metrics dynamically from shared application state.
 */
export function calculateDashboardKPIs({ requests = [], vehicles = [], disruptions = [], allocations = [] }) {
  const totalRequests = requests.length;

  const activeAllocations = requests.filter(
    (r) => r.status === 'matched' || r.status === 'in-progress'
  ).length;

  const availableVehicles = vehicles.filter(
    (v) => v.status === 'available' && v.verified !== false && (v.availableSeats || 0) > 0
  ).length;

  const studentsTravelling = requests
    .filter((r) => r.status === 'in-progress')
    .reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const unallocatedStudents = requests
    .filter((r) => r.status === 'unallocated' || (r.status === 'requested' && !r.matchedVehicle))
    .reduce((sum, r) => sum + Number(r.passengers || 1), 0);

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active').length;

  const totalRegisteredVehicles = vehicles.length;
  const completedJourneys = requests.filter((r) => r.status === 'completed').length;
  const pendingRequests = requests.filter((r) => r.status === 'requested').length;

  // Breakdown vehicles count
  const breakdownVehicles = vehicles.filter((v) => v.status === 'breakdown').length;

  // Allocation success rate
  const resolvedOrActive = activeAllocations + completedJourneys;
  const allocationRate =
    totalRequests > 0 ? Math.round((resolvedOrActive / totalRequests) * 100) : 0;

  return {
    totalRequests,
    activeAllocations,
    availableVehicles,
    studentsTravelling,
    unallocatedStudents,
    activeDisruptions,
    totalRegisteredVehicles,
    completedJourneys,
    pendingRequests,
    breakdownVehicles,
    allocationRate,
  };
}

/**
 * Returns multi-modal bus junction connections with connected student journey counts.
 */
export function getMajorBusJunctions(busSchedules = [], requests = []) {
  const junctions = [
    {
      id: 'JNC-01',
      name: 'Kunnamangalam Bus Hub',
      corridor: 'Kozhikode - REC / NIT Highway',
      type: 'Primary Transit Interchange',
      upcomingBusesCount: 4,
      connectedStudents: requests.filter((r) =>
        (r.pickupLocation || '').includes('Kunnamangalam') ||
        (r.destinationLocation || '').includes('Kunnamangalam') ||
        (r.preferredJunction || '').includes('Kunnamangalam')
      ).length,
      status: 'Normal Flow',
      statusColor: 'emerald',
      activeRoutes: ['Route 42', 'Route 14', 'Route 18'],
      gpsCoordinates: '11.3060° N, 75.8770° E',
    },
    {
      id: 'JNC-02',
      name: 'Mavoor Road Bus Bay',
      corridor: 'Mavoor - Medical College Connector',
      type: 'Disrupted Hub (Backup Active)',
      upcomingBusesCount: 2,
      connectedStudents: requests.filter((r) =>
        (r.pickupLocation || '').includes('Mavoor') ||
        (r.destinationLocation || '').includes('Mavoor') ||
        (r.preferredJunction || '').includes('Mavoor')
      ).length,
      status: 'Disrupted - Mechanical Breakdown',
      statusColor: 'rose',
      activeRoutes: ['Route 42', 'Route 18'],
      gpsCoordinates: '11.2612° N, 75.7950° E',
    },
    {
      id: 'JNC-03',
      name: 'Medical College Terminus',
      corridor: 'City Loop & Karanthur Link',
      type: 'Sub-Hub & Health Hub',
      upcomingBusesCount: 6,
      connectedStudents: requests.filter((r) =>
        (r.pickupLocation || '').includes('Medical College') ||
        (r.destinationLocation || '').includes('Medical College')
      ).length,
      status: 'On Schedule',
      statusColor: 'emerald',
      activeRoutes: ['Route 14', 'Route 108'],
      gpsCoordinates: '11.2721° N, 75.8361° E',
    },
    {
      id: 'JNC-04',
      name: 'GECK Campus Gate Bay',
      corridor: 'Campus Feeder Junction',
      type: 'Campus Terminal Bay',
      upcomingBusesCount: 3,
      connectedStudents: requests.filter((r) =>
        (r.destinationLocation || '').includes('GECK') ||
        (r.pickupLocation || '').includes('GECK')
      ).length,
      status: 'Community Carpools Active',
      statusColor: 'blue',
      activeRoutes: ['Route 18 (Campus Special)', 'Route 42'],
      gpsCoordinates: '11.3210° N, 75.9340° E',
    },
  ];

  return junctions;
}
