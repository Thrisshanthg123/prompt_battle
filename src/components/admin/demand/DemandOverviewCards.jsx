import React from 'react';
import {
  Users,
  TrendingUp,
  Sparkles,
  MapPin,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Compass,
} from 'lucide-react';
import AdminStatCard from '../AdminStatCard';

export default function DemandOverviewCards({ overview = {}, unallocatedFromContext = 0 }) {
  const totalRequests = overview.totalTransportRequests ?? 186;
  const avgDailyDemand = overview.averageDailyDemand ?? 168;
  const predictedDemand = overview.predictedFutureDemand ?? 214;
  const highDemandVillages = overview.villagesWithHighDemand ?? 4;
  const shortageRoutes = overview.routesWithCapacityShortage ?? 3;
  const unallocatedStudents = overview.totalUnallocatedStudents ?? unallocatedFromContext ?? 18;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <AdminStatCard
        title="Total Requests"
        value={totalRequests}
        subtitle="Cumulative recorded"
        icon={Users}
        color="blue"
        trend="+14% surge"
        trendDirection="up"
      />

      <AdminStatCard
        title="Avg Daily Demand"
        value={avgDailyDemand}
        subtitle="Student passengers / day"
        icon={Compass}
        color="indigo"
      />

      <AdminStatCard
        title="Predicted Demand"
        value={predictedDemand}
        subtitle="AI ML Projection"
        icon={Sparkles}
        color="purple"
        trend="+27% growth"
        trendDirection="up"
        badgeText="Forecast"
      />

      <AdminStatCard
        title="High Demand Hubs"
        value={highDemandVillages}
        subtitle="Villages > 30 Pax"
        icon={MapPin}
        color="amber"
      />

      <AdminStatCard
        title="Capacity Shortages"
        value={shortageRoutes}
        subtitle="Routes with seat deficit"
        icon={AlertTriangle}
        color="rose"
        trend="Deficit active"
        trendDirection="down"
      />

      <AdminStatCard
        title="Unallocated Queue"
        value={unallocatedStudents}
        subtitle="Stranded student risk"
        icon={AlertOctagon}
        color={unallocatedStudents > 0 ? 'rose' : 'emerald'}
        badgeText={unallocatedStudents > 0 ? 'Attention' : 'Clear'}
      />
    </div>
  );
}
