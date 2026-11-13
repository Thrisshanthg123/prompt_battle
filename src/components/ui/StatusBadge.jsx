import React from 'react';
import { getStatusColor } from '../../utils/formatters';

export default function StatusBadge({ status }) {
  const colorClasses = getStatusColor(status);

  const formatText = (str) => {
    if (!str) return 'Unknown';
    if (str === 'in-progress') return 'In Progress';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {formatText(status)}
    </span>
  );
}
