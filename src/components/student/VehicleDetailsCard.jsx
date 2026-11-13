import React from 'react';
import {
  Car,
  Phone,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Navigation,
  AlertOctagon,
} from 'lucide-react';

export default function VehicleDetailsCard({ vehicle, pickupLocation, scheduledTime, status }) {
  if (!vehicle) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <Car className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800">
            Scanning for Nearby Community Drivers
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Member 2’s AI Matching Engine is currently evaluating verified autos, vans, and parent carpools near {pickupLocation || 'your location'}.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>Matching Queue Active</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Assigned Community Driver
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            {vehicle.driverName}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Driver</span>
        </div>
      </div>

      {/* Driver Profile & Vehicle Specs */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/20 shrink-0">
          {vehicle.driverName.charAt(0)}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-slate-100 px-2 py-0.5 rounded text-slate-900 border border-slate-200">
              {vehicle.vehicleNumber}
            </span>
            <span className="text-xs text-slate-600 font-semibold truncate">
              {vehicle.vehicleType}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
              <span>{vehicle.rating || 4.9}</span>
            </div>
            <span>•</span>
            <span>{vehicle.totalTrips || 180}+ Completed Rides</span>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-medium block">Pickup Location</span>
          <p className="font-bold text-slate-800 truncate">{pickupLocation || 'Designated Stop'}</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-medium block">Scheduled Departure</span>
          <p className="font-bold text-slate-800">{scheduledTime || 'Immediate'}</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-medium block">Live ETA</span>
          <p className="font-bold text-emerald-700">{vehicle.eta || '3-5 mins away'}</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-400 font-medium block">Current GPS</span>
          <p className="font-semibold text-slate-700 truncate">
            {vehicle.liveLocation || 'En Route to Pickup Point'}
          </p>
        </div>
      </div>

      {/* Direct Authorized Contact Action */}
      {vehicle.driverPhone && (
        <a
          href={`tel:${vehicle.driverPhone}`}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition hover:scale-101"
        >
          <Phone className="w-4 h-4" />
          <span>Call Driver ({vehicle.driverPhone})</span>
        </a>
      )}

      {/* Privacy Notice */}
      <p className="text-[10px] text-slate-400 text-center">
        🔒 Driver identity is verified via Kerala RTO & Campus Security. Contact details are authorized solely for journey coordination.
      </p>
    </div>
  );
}
