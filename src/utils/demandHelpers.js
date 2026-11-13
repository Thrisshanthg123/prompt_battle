/**
 * ============================================================================
 * SANCHAARI – DEMAND INTELLIGENCE HELPERS & BADGE CONFIGURATIONS
 * ============================================================================
 * 
 * File: src/utils/demandHelpers.js
 * Assigned Owner: MEMBER 3 (Demand Intelligence Frontend Integration)
 */

/**
 * Returns Tailwind CSS badge classes and formatted labels for village demand classification.
 * Classifications: LOW, MEDIUM, HIGH, CRITICAL
 */
export function getDemandClassificationBadge(classification) {
  const norm = (classification || 'LOW').toUpperCase();

  switch (norm) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 font-extrabold',
        dotClass: 'bg-rose-500 animate-pulse',
        description: 'Severe transit shortage; high risk of stranded students',
      };
    case 'HIGH':
      return {
        label: 'HIGH',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
        dotClass: 'bg-amber-500',
        description: 'Heavy passenger demand exceeding standard capacity',
      };
    case 'MEDIUM':
      return {
        label: 'MEDIUM',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 font-semibold',
        dotClass: 'bg-blue-500',
        description: 'Moderate demand; currently handled with narrow reserve',
      };
    case 'LOW':
    default:
      return {
        label: 'LOW',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium',
        dotClass: 'bg-emerald-500',
        description: 'Normal transportation demand with sufficient capacity',
      };
  }
}

/**
 * Returns Tailwind CSS badge classes for AI Recommendation priority levels.
 * Priorities: CRITICAL, HIGH, MEDIUM, LOW
 */
export function getRecommendationPriorityBadge(priority) {
  const norm = (priority || 'LOW').toUpperCase();

  switch (norm) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL PRIORITY',
        badgeClass: 'bg-rose-600 text-white font-extrabold shadow-xs',
        borderClass: 'border-l-4 border-rose-500',
        cardBg: 'bg-rose-50/40',
        textColor: 'text-rose-950',
      };
    case 'HIGH':
      return {
        label: 'HIGH PRIORITY',
        badgeClass: 'bg-amber-600 text-white font-bold shadow-xs',
        borderClass: 'border-l-4 border-amber-500',
        cardBg: 'bg-amber-50/40',
        textColor: 'text-amber-950',
      };
    case 'MEDIUM':
      return {
        label: 'MEDIUM PRIORITY',
        badgeClass: 'bg-blue-600 text-white font-bold shadow-xs',
        borderClass: 'border-l-4 border-blue-500',
        cardBg: 'bg-blue-50/30',
        textColor: 'text-blue-950',
      };
    case 'LOW':
    default:
      return {
        label: 'LOW PRIORITY',
        badgeClass: 'bg-emerald-600 text-white font-semibold shadow-xs',
        borderClass: 'border-l-4 border-emerald-500',
        cardBg: 'bg-emerald-50/30',
        textColor: 'text-emerald-950',
      };
  }
}

/**
 * Returns Tailwind CSS badge classes for route capacity status.
 */
export function getRouteStatusBadge(status, shortage = 0) {
  if (shortage > 15 || status === 'CRITICAL_DEFICIT') {
    return {
      label: 'Critical Shortage',
      className: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
      iconColor: 'text-rose-600',
    };
  }
  if (shortage > 5 || status === 'HIGH_DEFICIT' || status === 'MODERATE_DEFICIT') {
    return {
      label: 'Capacity Shortage',
      className: 'bg-amber-100 text-amber-800 border-amber-200 font-semibold',
      iconColor: 'text-amber-600',
    };
  }
  return {
    label: 'Balanced Fleet',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold',
    iconColor: 'text-emerald-600',
  };
}

/**
 * Computes seat utilization percentage safely.
 */
export function calculateSeatUtilization(allocated = 0, available = 1) {
  if (available <= 0) return 100;
  return Math.min(100, Math.round((allocated / available) * 100));
}

/**
 * Filter villages dataset by query and search keyword.
 */
export function filterVillages(villages = [], filterVillage = 'all', searchQuery = '') {
  return villages.filter((v) => {
    const matchesVillage =
      filterVillage === 'all' ||
      v.village.toLowerCase().includes(filterVillage.toLowerCase());

    const matchesSearch =
      !searchQuery ||
      v.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.riskFactor && v.riskFactor.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesVillage && matchesSearch;
  });
}
