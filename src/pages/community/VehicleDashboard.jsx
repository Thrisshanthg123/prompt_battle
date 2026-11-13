
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CarFront,
  Users,
  Route,
  ShieldCheck,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  BrainCircuit,
  Activity,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function VehicleDashboard() {
  const navigate = useNavigate();
  const { vehicles = [], journeys = [], allocations = [] } = useMobility();

  const totalVehicles = vehicles.length;

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status === 'available'
  ).length;

  const availableSeats = vehicles.reduce(
    (total, vehicle) => total + (Number(vehicle.availableSeats) || 0),
    0
  );

  const verifiedVehicles = vehicles.filter(
    (vehicle) => vehicle.verified === true
  ).length;

  const activeJourneys = journeys.filter(
    (journey) =>
      ['requested', 'matched', 'in-progress'].includes(journey.status)
  );

  const allocatedStudents = allocations.reduce(
    (total, allocation) =>
      total + (Number(allocation.passengerCount) || 0),
    0
  );

  const stats = [
    {
      label: 'Registered Vehicles',
      value: totalVehicles,
      icon: CarFront,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Available Vehicles',
      value: availableVehicles,
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Available Seats',
      value: availableSeats,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Verified Vehicles',
      value: verifiedVehicles,
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-7 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            MEMBER 2 · COMMUNITY TRANSPORT
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
            Vehicle Owner Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage your vehicles, journeys and student allocations.
          </p>
        </div>

        <button
          onClick={() => navigate('/community-portal/register')}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Register Vehicle
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Live overview
                </span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 mt-4">
                {stat.value}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Journey and allocation overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Student Requests</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {activeJourneys.length}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Requests waiting, matched or currently in progress.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Students Allocated</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {allocatedStudents}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Based on recorded matching allocations.
          </p>
        </div>
      </div>

      {/* AI Matching Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <BrainCircuit className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Intelligent Vehicle Matching
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Find compatible vehicles using route compatibility,
                departure time, owner approval and available seats.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/community-portal/matching')}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
          >
            View Matching
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Registered Vehicles */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">
              Registered Vehicles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Overview of community transport providers.
            </p>
          </div>

          <button
            onClick={() => navigate('/community-portal/register')}
            className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
          >
            + Add Vehicle
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {vehicles.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No vehicles registered yet. Add your first vehicle to get started.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                    <CarFront className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {vehicle.driverName || vehicle.ownerName || 'Vehicle Owner'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {vehicle.vehicleType} · {vehicle.vehicleNumber || vehicle.registrationNumber}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {vehicle.baseLocation || vehicle.currentLocation || 'Location not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-slate-400">Available seats</p>
                    <p className="font-bold text-slate-800">
                      {vehicle.availableSeats ?? 0} / {vehicle.capacity ?? vehicle.passengerCapacity ?? 0}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      vehicle.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : vehicle.status === 'on-trip'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {vehicle.status || 'Unknown'}
                    </span>

                    {vehicle.verified && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active requests */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">
            Recent Student Requests
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Latest requests shared by the student portal.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {activeJourneys.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No active student requests.
            </p>
          ) : (
            activeJourneys.slice(0, 5).map((journey) => (
              <div
                key={journey.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {journey.studentName || 'Student'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {journey.pickupLocation} → {journey.destinationLocation}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {journey.scheduledTime || 'Time not specified'}
                  </p>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 w-fit">
                  {journey.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
