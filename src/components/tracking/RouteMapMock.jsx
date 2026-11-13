import React from 'react';
import { MapPin, Navigation, Compass, ShieldCheck } from 'lucide-react';

export default function RouteMapMock({
  origin = 'Pickup Point',
  destination = 'Destination Point',
  vehicle = null,
  status = 'in-progress',
}) {
  const isEnRoute = status === 'in-progress';
  const isCompleted = status === 'completed';

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white shadow-lg relative">
      {/* Map Header Overlay */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-md flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Live Mobility Radar</h4>
            <p className="text-xs text-slate-400">Calicut Transit Corridor GPS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Community SafeRoute Active
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Representation */}
      <div className="relative h-64 w-full bg-slate-950 flex items-center justify-center p-6">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Route Visualization */}
        <svg className="w-full h-full" viewBox="0 0 600 220" fill="none">
          {/* Roads */}
          <path
            d="M 50 160 C 150 160, 200 60, 320 70 S 480 180, 550 90"
            stroke="#334155"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Route Path */}
          <path
            d="M 50 160 C 150 160, 200 60, 320 70 S 480 180, 550 90"
            stroke={isCompleted ? '#10b981' : '#3b82f6'}
            strokeWidth="4"
            strokeDasharray={isEnRoute ? '6 6' : 'none'}
            className={isEnRoute ? 'animate-pulse' : ''}
          />

          {/* Origin Marker */}
          <g transform="translate(50, 160)">
            <circle r="12" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
            <circle r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Midpoint / Disruption Point */}
          <g transform="translate(230, 95)">
            <circle r="6" fill="#f59e0b" />
            <text x="10" y="4" fill="#fbbf24" fontSize="11" fontWeight="bold">
              Bus Breakdown Point (Mavoor)
            </text>
          </g>

          {/* Destination Marker */}
          <g transform="translate(550, 90)">
            <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Vehicle Indicator */}
          {vehicle && (
            <g
              transform={
                isCompleted
                  ? 'translate(545, 80)'
                  : isEnRoute
                  ? 'translate(340, 75)'
                  : 'translate(65, 150)'
              }
              className="transition-all duration-1000 ease-in-out"
            >
              <rect x="-18" y="-18" width="36" height="36" rx="18" fill="#10b981" fillOpacity="0.25" />
              <circle r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="-25" y="-16" fill="#34d399" fontSize="11" fontWeight="bold">
                {vehicle.vehicleType?.includes('Auto') ? '🛺' : '🚐'} {vehicle.vehicleNumber}
              </text>
            </g>
          )}
        </svg>

        {/* Floating details overlay on bottom */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400">Pickup: </span>
              <span className="font-semibold text-slate-200">{origin}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400">Destination: </span>
              <span className="font-semibold text-slate-200">{destination}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {isCompleted ? 'Arrival Confirmed' : isEnRoute ? 'Speed: ~34 km/h • ETA: 4m' : 'Awaiting Departure'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
