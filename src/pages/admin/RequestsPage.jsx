import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  AlertOctagon,
  Search,
  Filter,
  Plus,
  Compass,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import RequestTable from '../../components/admin/RequestTable';
import AdminStatCard from '../../components/admin/AdminStatCard';

export default function RequestsPage() {
  const { journeys } = useMobility();

  const totalRequests = journeys.length;
  const pendingRequests = journeys.filter((r) => r.status === 'requested').length;
  const assignedRequests = journeys.filter((r) => r.status === 'matched' || r.status === 'in-progress').length;
  const completedRequests = journeys.filter((r) => r.status === 'completed').length;
  const unallocatedRequests = journeys.filter((r) => r.status === 'unallocated').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Student Transport Request Monitoring
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {totalRequests} Requests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track student ride requests, real-time vehicle matches, and identify stranded students requiring community pool assistance.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Requests"
          value={totalRequests}
          subtitle="All recorded journeys"
          icon={Users}
          color="blue"
        />

        <AdminStatCard
          title="Assigned / Active"
          value={assignedRequests}
          subtitle="Matched with driver"
          icon={CheckCircle}
          color="emerald"
        />

        <AdminStatCard
          title="Pending Queue"
          value={pendingRequests}
          subtitle="Awaiting match"
          icon={Clock}
          color="amber"
        />

        <AdminStatCard
          title="Unallocated Students"
          value={unallocatedRequests}
          subtitle={unallocatedRequests > 0 ? 'Requires attention' : 'Queue clear'}
          icon={AlertOctagon}
          color={unallocatedRequests > 0 ? 'rose' : 'emerald'}
          trend={unallocatedRequests > 0 ? 'Action Needed' : 'Zero Stranded'}
          trendDirection={unallocatedRequests > 0 ? 'down' : 'up'}
        />
      </div>

      {/* Main Request Table Component */}
      <RequestTable requests={journeys} />
    </div>
  );
}
