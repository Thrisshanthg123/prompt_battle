import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  RefreshCw,
  Loader2,
  Database,
  ArrowRight,
  AlertOctagon,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import {
  fetchDemandOverview,
  fetchVillageDemand,
  fetchPeakPeriods,
  fetchRouteCapacities,
  fetchAIRecommendations,
  fetchDemandForecast,
  invalidateDemandCache,
} from '../../services/demandAnalyticsService';

import DataSourceBadge from '../../components/admin/demand/DataSourceBadge';
import DemandFilters from '../../components/admin/demand/DemandFilters';
import DemandOverviewCards from '../../components/admin/demand/DemandOverviewCards';
import VillageDemandChart from '../../components/admin/demand/VillageDemandChart';
import PeakTravelChart from '../../components/admin/demand/PeakTravelChart';
import RouteCapacityChart from '../../components/admin/demand/RouteCapacityChart';
import AIRecommendations from '../../components/admin/demand/AIRecommendations';
import DemandForecastChart from '../../components/admin/demand/DemandForecastChart';
import AIInsightsPanel from '../../components/admin/demand/AIInsightsPanel';

export default function DemandIntelligencePage() {
  const { journeys, showAlert } = useMobility();

  // State management
  const [dateRange, setDateRange] = useState('7d');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastHorizon, setForecastHorizon] = useState('7d');

  // API datasets
  const [overview, setOverview] = useState({});
  const [villages, setVillages] = useState([]);
  const [peakPeriods, setPeakPeriods] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [forecast, setForecast] = useState([]);

  // Data status
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSynthetic, setIsSynthetic] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Load analytics data
  const loadAnalytics = useCallback(async (bypassCache = false) => {
    if (bypassCache) {
      invalidateDemandCache();
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const [ovRes, vilRes, peakRes, routeRes, recRes, fcRes] = await Promise.all([
        fetchDemandOverview({ dateRange }),
        fetchVillageDemand({ dateRange, village: selectedVillage }),
        fetchPeakPeriods({ dateRange }),
        fetchRouteCapacities({ dateRange }),
        fetchAIRecommendations({}),
        fetchDemandForecast({ horizon: forecastHorizon }),
      ]);

      setOverview(ovRes.data || {});
      setVillages(vilRes.data || []);
      setPeakPeriods(peakRes.data || []);
      setRoutes(routeRes.data || []);
      setRecommendations(recRes.data || []);
      setForecast(fcRes.data || []);

      setIsSynthetic(ovRes.isSynthetic);
      setDataSource(ovRes.source);
      setLastSyncedTime(ovRes.timestamp);
    } catch (err) {
      console.error('Error fetching demand intelligence:', err);
      setErrorMessage(
        'Unable to establish connection to Member 4 Predictive Service. Showing fallback demo dataset.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dateRange, selectedVillage, forecastHorizon]);

  useEffect(() => {
    loadAnalytics(false);
  }, [loadAnalytics]);

  // Extract unique village names for the filter dropdown
  const villagesList = useMemo(() => {
    return Array.from(new Set(villages.map((v) => v.village))).filter(Boolean);
  }, [villages]);

  // Handle recommendation action
  const handleAcknowledgeRecommendation = (rec) => {
    showAlert(
      `✓ Proactive Dispatch Implemented: ${rec.recommendedAction}`,
      'success'
    );
  };

  const handleResetFilters = () => {
    setDateRange('7d');
    setSelectedVillage('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Predictive Demand Analysis & Transit Intelligence
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              AI Operations Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Anticipate student transportation bottlenecks in rural Kozhikode before buses halt. Powered by Member 4's machine learning demand forecasting model.
          </p>
        </div>
      </div>

      {/* 2. Data Source Provenance Bar */}
      <DataSourceBadge
        isSynthetic={isSynthetic}
        source={dataSource}
        lastUpdated={lastSyncedTime}
        onRefresh={() => loadAnalytics(true)}
        isLoading={isRefreshing}
      />

      {/* Error Message Notice (if any) */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => loadAnalytics(true)}
            className="text-xs font-bold underline text-amber-800 hover:text-amber-950"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 3. Global Filters Bar */}
      <DemandFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
        villagesList={villagesList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={handleResetFilters}
      />

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center animate-spin">
            <Loader2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">
              Loading Predictive Demand Intelligence...
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Querying Member 4's forecasting endpoints across rural Kozhikode corridors.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 4. Dashboard Overview KPI Cards */}
          <DemandOverviewCards
            overview={overview}
            unallocatedFromContext={journeys.filter((j) => j.status === 'unallocated').length}
          />

          {/* 5. Executive AI Synthesis Panel (Answering the 4 Core Questions) */}
          <AIInsightsPanel
            busiestVillage={overview.busiestVillage || 'Kunnamangalam Hub'}
            shortageRoutes={[overview.mostConstrainedRoute || 'Mavoor Road → GECK Gate']}
            nextPeakPeriod={overview.peakTravelPeriod || '08:00 AM – 09:15 AM'}
            targetHubsForVehicles={['Mavoor Road Hub (4 Autos)', 'Balussery Ghat Stand (2 Vans)']}
            overview={overview}
          />

          {/* 6. Section: Village Demand Analysis */}
          <VillageDemandChart
            villages={villages}
            selectedVillage={selectedVillage}
            searchQuery={searchQuery}
          />

          {/* 7. Section: Peak Travel Demand Prediction */}
          <PeakTravelChart peakData={peakPeriods} />

          {/* 8. Section: Route Demand vs Vehicle Capacity */}
          <RouteCapacityChart routesData={routes} />

          {/* 9. Section: AI Transport Recommendations */}
          <AIRecommendations
            recommendations={recommendations}
            onAcknowledge={handleAcknowledgeRecommendation}
          />

          {/* 10. Section: Demand Forecast (Historical vs Current vs Predicted) */}
          <DemandForecastChart
            forecastData={forecast}
            horizon={forecastHorizon}
            onHorizonChange={(h) => setForecastHorizon(h)}
            dataSource={dataSource}
          />
        </>
      )}
    </div>
  );
}
