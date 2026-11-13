/**
 * Formatters and UI Helper Utilities
 */

export function formatDate(isoOrString) {
  if (!isoOrString) return '';
  if (isoOrString.startsWith('Today') || isoOrString.startsWith('Yesterday')) {
    return isoOrString;
  }
  try {
    const d = new Date(isoOrString);
    if (isNaN(d.getTime())) return isoOrString;
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoOrString;
  }
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'matched':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'requested':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}

export function getUrgencyBadge(urgency) {
  switch (urgency?.toLowerCase()) {
    case 'high':
      return 'bg-rose-50 text-rose-700 border-rose-300 font-semibold';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-300';
    case 'low':
      return 'bg-slate-50 text-slate-700 border-slate-300';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-300';
  }
}
