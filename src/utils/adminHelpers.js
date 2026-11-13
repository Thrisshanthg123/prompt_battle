/**
 * ============================================================================
 * SANCHAARI - MEMBER 3 ADMIN HELPERS & UTILITIES
 * ============================================================================
 * 
 * File: src/utils/adminHelpers.js
 * Assigned Owner: MEMBER 3 (Admin Dashboard & Disruption Management)
 */

/**
 * Returns Tailwind CSS badge classes and formatted labels for Request statuses.
 */
export function getRequestStatusBadge(status) {
  switch (status) {
    case 'matched':
    case 'assigned':
      return {
        label: 'Assigned',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'in-progress':
      return {
        label: 'On Trip',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500 animate-pulse',
      };
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
    case 'unallocated':
      return {
        label: 'Unallocated',
        className: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
        dot: 'bg-rose-500 animate-ping',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'requested':
    case 'pending':
    default:
      return {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
  }
}

/**
 * Returns Tailwind CSS badge classes and formatted labels for Vehicle statuses.
 */
export function getVehicleStatusBadge(status, verified = true) {
  if (verified === false) {
    return {
      label: 'Unverified / Ineligible',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    };
  }

  switch (status) {
    case 'available':
      return {
        label: 'Available',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'on-trip':
    case 'assigned':
      return {
        label: 'On Trip',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'breakdown':
      return {
        label: 'Breakdown',
        className: 'bg-red-50 text-red-700 border-red-200 font-bold',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'unavailable':
    case 'offline':
    default:
      return {
        label: 'Unavailable',
        className: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

/**
 * Returns Tailwind CSS badge classes for Disruption severity.
 */
export function getSeverityBadge(severity) {
  switch (severity) {
    case 'Critical':
    case 'High':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

/**
 * Formats standard ISO timestamp into readable time string (e.g. 08:30 AM).
 */
export function formatAdminTime(dateStr) {
  if (!dateStr) return '--';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Formats standard ISO timestamp into full date string (e.g. 13 Nov 2026).
 */
export function formatAdminDate(dateStr) {
  if (!dateStr) return '--';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Exports JSON data to downloadable CSV file.
 */
export function exportToCSV(data = [], filename = 'sanchaari_export.csv') {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers
      .map((header) => {
        let val = obj[header];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        val = String(val ?? '').replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
