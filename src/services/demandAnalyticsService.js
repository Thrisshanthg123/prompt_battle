/**
 * ============================================================================
 * SANCHAARI – MEMBER 3 PREDICTIVE DEMAND ANALYTICS SERVICE
 * ============================================================================
 * 
 * File: src/services/demandAnalyticsService.js
 * Assigned Owner: MEMBER 3 (Demand Intelligence Frontend Integration)
 * Integrates: Member 4's Backend Forecasting & Supabase Analytics APIs
 * 
 * Endpoints:
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

// Simple in-memory cache to prevent redundant duplicate API calls
const cache = new Map();
const CACHE_TTL_MS = 25000; // 25 seconds

/**
 * Helper to fetch from Member 4's backend with timeout, cache, and graceful synthetic fallback.
 */
async function apiFetch(endpoint, queryParams = {}, fallbackFn) {
  const queryStr = new URLSearchParams(
    Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  ).toString();

  const fullUrl = `${API_BASE_URL}${endpoint}${queryStr ? `?${queryStr}` : ''}`;
  const cacheKey = fullUrl;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.payload;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const payload = {
        data,
        isSynthetic: false,
        source: 'Live Member 4 Backend API (Supabase & ML Engine)',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      cache.set(cacheKey, { timestamp: Date.now(), payload });
      return payload;
    }
    throw new Error(`HTTP ${response.status} from backend`);
  } catch (err) {
    // API is offline or endpoint not deployed yet; generate high-fidelity synthetic demo data
    const fallbackData = fallbackFn(queryParams);
    const payload = {
      data: fallbackData,
      isSynthetic: true,
      source: 'Simulated Demo Data (Member 4 Backend Offline)',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    cache.set(cacheKey, { timestamp: Date.now(), payload });
    return payload;
  }
}

/**
 * 1. Fetch Demand Overview Metrics
 * @param {Object} params - { dateRange: 'today' | '7d' | '30d' }
 */
export async function fetchDemandOverview(params = {}) {
  return apiFetch('/api/analytics/demand/overview', params, (p) => {
    const multiplier = p.dateRange === '30d' ? 4.2 : p.dateRange === '7d' ? 1.8 : 1.0;
    return {
      totalTransportRequests: Math.round(186 * multiplier),
      averageDailyDemand: 168,
      predictedFutureDemand: Math.round(214 * multiplier),
      villagesWithHighDemand: 4,
      routesWithCapacityShortage: 3,
      totalUnallocatedStudents: 18,
      peakTravelPeriod: '08:00 AM – 09:15 AM',
      peakDeficitSeats: 42,
      modelAccuracyScore: '92.6%',
      busiestVillage: 'Kunnamangalam Hub',
      mostConstrainedRoute: 'Mavoor Road → GECK Campus Gate',
    };
  });
}

/**
 * 2. Fetch Village-wise Demand Analysis
 * @param {Object} params - { dateRange, village }
 */
export async function fetchVillageDemand(params = {}) {
  return apiFetch('/api/analytics/demand/villages', params, (p) => {
    const rawVillages = [
      {
        village: 'Kunnamangalam Hub',
        totalRequests: 58,
        avgDailyDemand: 52,
        allocatedStudents: 42,
        unallocatedStudents: 16,
        vehicleCapacity: 45,
        shortageCount: 13,
        classification: 'CRITICAL',
        riskFactor: 'High recurring morning peak surge near bus bay',
      },
      {
        village: 'Mavoor Road',
        totalRequests: 48,
        avgDailyDemand: 44,
        allocatedStudents: 32,
        unallocatedStudents: 16,
        vehicleCapacity: 34,
        shortageCount: 14,
        classification: 'CRITICAL',
        riskFactor: 'Frequent public bus breakdowns on Route 42',
      },
      {
        village: 'Karanthur Junction',
        totalRequests: 34,
        avgDailyDemand: 30,
        allocatedStudents: 28,
        unallocatedStudents: 6,
        vehicleCapacity: 30,
        shortageCount: 4,
        classification: 'HIGH',
        riskFactor: 'Intermediate stop congestion before Medical College',
      },
      {
        village: 'Kuttikkattoor',
        totalRequests: 31,
        avgDailyDemand: 28,
        allocatedStudents: 22,
        unallocatedStudents: 9,
        vehicleCapacity: 24,
        shortageCount: 7,
        classification: 'HIGH',
        riskFactor: 'Limited feeder autos during 8:15 AM window',
      },
      {
        village: 'Chathamangalam',
        totalRequests: 26,
        avgDailyDemand: 24,
        allocatedStudents: 22,
        unallocatedStudents: 4,
        vehicleCapacity: 22,
        shortageCount: 4,
        classification: 'MEDIUM',
        riskFactor: 'Moderate carpool availability along NIT corridor',
      },
      {
        village: 'Balussery Ghat',
        totalRequests: 29,
        avgDailyDemand: 25,
        allocatedStudents: 16,
        unallocatedStudents: 13,
        vehicleCapacity: 16,
        shortageCount: 13,
        classification: 'CRITICAL',
        riskFactor: 'Steep ghat road with minimal private vehicle pooling',
      },
      {
        village: 'Palayam Central',
        totalRequests: 24,
        avgDailyDemand: 22,
        allocatedStudents: 22,
        unallocatedStudents: 2,
        vehicleCapacity: 28,
        shortageCount: 0,
        classification: 'LOW',
        riskFactor: 'Well served by town shuttle buses',
      },
      {
        village: 'Koduvally',
        totalRequests: 20,
        avgDailyDemand: 18,
        allocatedStudents: 16,
        unallocatedStudents: 4,
        vehicleCapacity: 18,
        shortageCount: 2,
        classification: 'MEDIUM',
        riskFactor: 'Feeder link to National Highway',
      },
    ];

    if (p.village && p.village !== 'all') {
      return rawVillages.filter((v) =>
        v.village.toLowerCase().includes(p.village.toLowerCase())
      );
    }
    return rawVillages;
  });
}

/**
 * 3. Fetch Peak Travel Prediction Data
 * @param {Object} params - { dateRange }
 */
export async function fetchPeakPeriods(params = {}) {
  return apiFetch('/api/analytics/demand/peak-periods', params, () => [
    {
      period: '06:00 AM – 07:00 AM',
      timeSlot: '6 AM - 7 AM',
      historicalDemand: 12,
      predictedDemand: 16,
      availableCapacity: 22,
      deficit: 0,
      isPeak: false,
    },
    {
      period: '07:00 AM – 08:00 AM',
      timeSlot: '7 AM - 8 AM',
      historicalDemand: 38,
      predictedDemand: 46,
      availableCapacity: 34,
      deficit: 12,
      isPeak: false,
    },
    {
      period: '08:00 AM – 09:00 AM',
      timeSlot: '8 AM - 9 AM',
      historicalDemand: 74,
      predictedDemand: 92,
      availableCapacity: 50,
      deficit: 42,
      isPeak: true, // Absolute Busiest Peak
    },
    {
      period: '09:00 AM – 10:00 AM',
      timeSlot: '9 AM - 10 AM',
      historicalDemand: 48,
      predictedDemand: 56,
      availableCapacity: 48,
      deficit: 8,
      isPeak: false,
    },
    {
      period: '12:00 PM – 02:00 PM (Afternoon)',
      timeSlot: '12 PM - 2 PM',
      historicalDemand: 22,
      predictedDemand: 26,
      availableCapacity: 38,
      deficit: 0,
      isPeak: false,
    },
    {
      period: '03:30 PM – 04:30 PM (Lab Return)',
      timeSlot: '3:30 PM - 4:30 PM',
      historicalDemand: 42,
      predictedDemand: 49,
      availableCapacity: 40,
      deficit: 9,
      isPeak: false,
    },
    {
      period: '04:30 PM – 05:30 PM (Evening Peak)',
      timeSlot: '4:30 PM - 5:30 PM',
      historicalDemand: 68,
      predictedDemand: 82,
      availableCapacity: 46,
      deficit: 36,
      isPeak: true, // Evening Busiest Peak
    },
    {
      period: '05:30 PM – 07:00 PM',
      timeSlot: '5:30 PM - 7 PM',
      historicalDemand: 28,
      predictedDemand: 34,
      availableCapacity: 36,
      deficit: 0,
      isPeak: false,
    },
  ]);
}

/**
 * 4. Fetch Route Capacity & Shortage Data
 * @param {Object} params - { dateRange }
 */
export async function fetchRouteCapacities(params = {}) {
  return apiFetch('/api/analytics/demand/routes', params, () => [
    {
      id: 'RT-01',
      route: 'Mavoor Road → GECK Campus Gate',
      studentDemand: 48,
      availableSeats: 32,
      allocatedStudents: 32,
      unallocatedStudents: 16,
      capacityShortage: 16,
      seatUtilization: 100,
      verifiedVehiclesCount: 8,
      status: 'CRITICAL_DEFICIT',
      recurringShortage: true,
    },
    {
      id: 'RT-02',
      route: 'Balussery Ghat → City Central Stand',
      studentDemand: 34,
      availableSeats: 16,
      allocatedStudents: 16,
      unallocatedStudents: 18,
      capacityShortage: 18,
      seatUtilization: 100,
      verifiedVehiclesCount: 4,
      status: 'CRITICAL_DEFICIT',
      recurringShortage: true,
    },
    {
      id: 'RT-03',
      route: 'Kunnamangalam Hub → REC / NIT Calicut',
      studentDemand: 60,
      availableSeats: 52,
      allocatedStudents: 50,
      unallocatedStudents: 10,
      capacityShortage: 8,
      seatUtilization: 96,
      verifiedVehiclesCount: 12,
      status: 'MODERATE_DEFICIT',
      recurringShortage: false,
    },
    {
      id: 'RT-04',
      route: 'Karanthur → Medical College Junction',
      studentDemand: 26,
      availableSeats: 26,
      allocatedStudents: 24,
      unallocatedStudents: 2,
      capacityShortage: 0,
      seatUtilization: 92,
      verifiedVehiclesCount: 6,
      status: 'BALANCED',
      recurringShortage: false,
    },
    {
      id: 'RT-05',
      route: 'Kuttikkattoor → GECK Main Gate',
      studentDemand: 31,
      availableSeats: 20,
      allocatedStudents: 20,
      unallocatedStudents: 11,
      capacityShortage: 11,
      seatUtilization: 100,
      verifiedVehiclesCount: 5,
      status: 'HIGH_DEFICIT',
      recurringShortage: true,
    },
    {
      id: 'RT-06',
      route: 'Palayam Bus Stand → Campus Express Bay',
      studentDemand: 36,
      availableSeats: 38,
      allocatedStudents: 34,
      unallocatedStudents: 2,
      capacityShortage: 0,
      seatUtilization: 89,
      verifiedVehiclesCount: 9,
      status: 'BALANCED',
      recurringShortage: false,
    },
  ]);
}

/**
 * 5. Fetch AI Transport Recommendations
 * @param {Object} params - { priority }
 */
export async function fetchAIRecommendations(params = {}) {
  return apiFetch('/api/analytics/demand/recommendations', params, (p) => {
    const rawRecs = [
      {
        id: 'REC-01',
        priority: 'CRITICAL',
        priorityColor: 'rose',
        route: 'Mavoor Road → GECK Campus Gate',
        village: 'Mavoor Road',
        problem:
          'Morning demand exceeds verified vehicle seats by 16 students (+50% capacity deficit) due to Route 42 KSRTC breakdown history.',
        supportingData: {
          projectedDemand: 48,
          currentCapacity: 32,
          seatShortage: 16,
          historicalDisruptions: '6 incidents in last 14 days',
        },
        recommendedAction:
          'Incentivize 4 additional registered 4-seater community auto-rickshaws to stage at Mavoor Road Hub between 07:45 AM – 08:45 AM.',
        relevantTimePeriod: '07:45 AM – 08:45 AM (Weekdays)',
        confidenceScore: 94,
        impact: 'Prevents 16 student strandings and cuts average wait time by 32 minutes.',
      },
      {
        id: 'REC-02',
        priority: 'HIGH',
        priorityColor: 'amber',
        route: 'Balussery Ghat → City Central Stand',
        village: 'Balussery Ghat',
        problem:
          'Steep terrain and low vehicle density leave 18 unallocated students during the 7:30 AM departure wave.',
        supportingData: {
          projectedDemand: 34,
          currentCapacity: 16,
          seatShortage: 18,
          historicalDisruptions: 'Recurring roadblock & tree-fall zone',
        },
        recommendedAction:
          'Partner with 2 local 7-seater community vans for pre-scheduled carpool pools starting from Balussery bus stand.',
        relevantTimePeriod: '07:15 AM – 08:00 AM',
        confidenceScore: 89,
        impact: 'Provides guaranteed seat allocation and reduces per-student pool fare by 35%.',
      },
      {
        id: 'REC-03',
        priority: 'HIGH',
        priorityColor: 'amber',
        route: 'Kuttikkattoor → GECK Main Gate',
        village: 'Kuttikkattoor',
        problem:
          'Unallocated student queue is steadily growing (+11 pax) as public buses bypass stop due to overcrowding.',
        supportingData: {
          projectedDemand: 31,
          currentCapacity: 20,
          seatShortage: 11,
          historicalDisruptions: 'Bus skip-stop incidents reported 4 times',
        },
        recommendedAction:
          'Notify nearby verified parent carpools along Mavoor-Kuttikkattoor bypass to activate rideshare listings.',
        relevantTimePeriod: '08:10 AM – 08:45 AM',
        confidenceScore: 88,
        impact: 'Absorbs 100% of overflow students without adding commercial auto burden.',
      },
      {
        id: 'REC-04',
        priority: 'MEDIUM',
        priorityColor: 'blue',
        route: 'GECK Campus Gate → Kunnamangalam Hub (Evening Return)',
        village: 'Kunnamangalam',
        problem:
          'Evening last-mile gap: Public buses stop operating frequent runs post-4:15 PM, leaving 36 lab students stranded.',
        supportingData: {
          projectedDemand: 42,
          currentCapacity: 22,
          seatShortage: 20,
          historicalDisruptions: 'Daily scheduled frequency cliff at 4:15 PM',
        },
        recommendedAction:
          'Establish a scheduled 4:30 PM & 5:15 PM community shuttle rotation linking Campus Gate to Kunnamangalam Bus Bay.',
        relevantTimePeriod: '04:30 PM – 05:45 PM',
        confidenceScore: 85,
        impact: 'Eliminates 55-minute evening wait for campus-to-hostel students.',
      },
      {
        id: 'REC-05',
        priority: 'LOW',
        priorityColor: 'emerald',
        route: 'Karanthur → Medical College Junction',
        village: 'Karanthur Junction',
        problem:
          'Minor surge during exam weeks; current fleet operates at 92% capacity with narrow safety margin.',
        supportingData: {
          projectedDemand: 26,
          currentCapacity: 26,
          seatShortage: 0,
          historicalDisruptions: 'Zero critical breakdowns',
        },
        recommendedAction:
          'Maintain standby reserve of 1 electric auto rickshaw at Karanthur auto stand for backup.',
        relevantTimePeriod: '08:30 AM – 09:15 AM',
        confidenceScore: 81,
        impact: 'Provides resilience against random vehicle maintenance delays.',
      },
    ];

    if (p.priority && p.priority !== 'all') {
      return rawRecs.filter((r) => r.priority.toLowerCase() === p.priority.toLowerCase());
    }
    return rawRecs;
  });
}

/**
 * 6. Fetch Demand Forecast Data
 * @param {Object} params - { horizon: '1d' | '7d' | '30d' }
 */
export async function fetchDemandForecast(params = {}) {
  const horizon = params.horizon || '7d';

  return apiFetch('/api/analytics/demand/forecast', params, () => {
    if (horizon === '1d') {
      // Hourly forecast for next day
      return [
        { time: '06:00 AM', historical: 14, current: 15, forecast: 16, upper: 18, lower: 14 },
        { time: '07:00 AM', historical: 36, current: 40, forecast: 45, upper: 50, lower: 40 },
        { time: '08:00 AM', historical: 72, current: 80, forecast: 92, upper: 98, lower: 84 },
        { time: '09:00 AM', historical: 48, current: 52, forecast: 58, upper: 64, lower: 50 },
        { time: '11:00 AM', historical: 16, current: 18, forecast: 20, upper: 24, lower: 16 },
        { time: '01:00 PM', historical: 22, current: 24, forecast: 26, upper: 30, lower: 22 },
        { time: '03:00 PM', historical: 38, current: 42, forecast: 48, upper: 54, lower: 42 },
        { time: '05:00 PM', historical: 66, current: 74, forecast: 82, upper: 89, lower: 75 },
        { time: '07:00 PM', historical: 24, current: 26, forecast: 30, upper: 35, lower: 25 },
      ];
    }

    if (horizon === '30d') {
      // 4-week forecast summary
      return [
        { day: 'Week 1', historical: 980, current: 1040, forecast: 1120, upper: 1190, lower: 1050 },
        { day: 'Week 2', historical: 1020, current: 1080, forecast: 1180, upper: 1260, lower: 1100 },
        { day: 'Week 3 (Exams)', historical: 1150, current: 1210, forecast: 1340, upper: 1420, lower: 1260 },
        { day: 'Week 4', historical: 1010, current: 1060, forecast: 1140, upper: 1210, lower: 1070 },
      ];
    }

    // Default: Next 7 days
    return [
      { day: 'Mon', historical: 145, current: 152, forecast: 165, upper: 176, lower: 154 },
      { day: 'Tue', historical: 162, current: 168, forecast: 174, upper: 185, lower: 163 },
      { day: 'Wed', historical: 158, current: 165, forecast: 178, upper: 190, lower: 166 },
      { day: 'Thu', historical: 170, current: 176, forecast: 186, upper: 198, lower: 174 },
      { day: 'Fri', historical: 195, current: 204, forecast: 218, upper: 232, lower: 202 },
      { day: 'Sat', historical: 78, current: 82, forecast: 88, upper: 96, lower: 79 },
      { day: 'Sun', historical: 32, current: 34, forecast: 38, upper: 44, lower: 31 },
    ];
  });
}

/**
 * Clear the analytics cache to force fresh data retrieval
 */
export function invalidateDemandCache() {
  cache.clear();
}
