import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  User,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Car,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import StatusBadge from '../../components/ui/StatusBadge';
import RouteMapMock from '../../components/tracking/RouteMapMock';
import LiveTrackerSimulator from '../../components/tracking/LiveTrackerSimulator';
import { formatDate, getUrgencyBadge } from '../../utils/formatters';

export default function JourneyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journeys, studentProfile } = useMobility();

  // Find targeted journey or fallback to active
  const journey = journeys.find((j) => j.id === id) || journeys[0];

  if (!journey) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">No Journey Found</h2>
        <p className="text-xs text-slate-500 mt-1">Please select an existing trip from My Journeys.</p>
        <Link
          to="/my-journeys"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Journeys
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Journey Tracking & Details
              </h1>
              <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                {journey.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinated Community Transit Link • Created {formatDate(journey.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={journey.status} />
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(journey.urgency)}`}>
            {journey.urgency} Urgency
          </span>
        </div>
      </div>

      {/* Live Route Radar Map */}
      <RouteMapMock
        origin={journey.pickupLocation}
        destination={journey.destinationLocation}
        vehicle={journey.matchedVehicle}
        status={journey.status}
      />

      {/* Interactive Hackathon Simulator & Emergency Controls */}
      <LiveTrackerSimulator journey={journey} />

      {/* Two Column Grid: Trip Details & Tracking Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tracking Stepper & Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Live Transit Timeline
            </h3>
            <p className="text-xs text-slate-500">Real-time status updates broadcast to your student portal</p>
          </div>

          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {journey.trackingSteps.map((step, idx) => (
              <div key={step.id || idx} className="relative flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    step.done
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.label}
                    </p>
                    <span className="text-xs font-mono text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown / Onward Bus Context Card */}
          {journey.onwardBusDetails && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Associated Public Transit Disruption
                </span>
              </div>
              <p className="text-xs font-semibold">{journey.onwardBusDetails.busNumber}</p>
              <p className="text-[11px] text-blue-800">
                Disruption: {journey.onwardBusDetails.disruptedAt || 'General Route Delay'} •{' '}
                {journey.onwardBusDetails.expectedDelay || 'Alternative Community Transit Provided'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Driver & Safety Card */}
        <div className="space-y-6">
          {/* Assigned Driver Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Community Driver Information
            </h3>

            {journey.matchedVehicle ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    {journey.matchedVehicle.driverName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {journey.matchedVehicle.driverName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      ★ {journey.matchedVehicle.rating} rating • {journey.matchedVehicle.totalTrips || 120}+ trips
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vehicle Type:</span>
                    <span className="font-semibold text-slate-800">{journey.matchedVehicle.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plate Number:</span>
                    <span className="font-mono font-bold text-slate-800">{journey.matchedVehicle.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current GPS:</span>
                    <span className="font-semibold text-emerald-700">{journey.matchedVehicle.liveLocation || 'En Route'}</span>
                  </div>
                </div>

                <a
                  href={`tel:${journey.matchedVehicle.driverPhone}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Driver ({journey.matchedVehicle.driverPhone})</span>
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2">
                <Car className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Driver Not Yet Assigned</p>
                <p className="text-[11px] text-slate-500">
                  Member 2's AI matching engine is scanning available community vehicles in your radius.
                </p>
              </div>
            )}
          </div>

          {/* Student Safety Verification */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Community Transit Shield</h4>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Live journey coordinates and driver verification details are synced with your emergency contact (
              <strong>{studentProfile.emergencyContact.name}</strong>).
            </p>
            <div className="text-[11px] text-emerald-700 border-t border-emerald-200 pt-2">
              College Helpdesk: +91 495 228 8000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
