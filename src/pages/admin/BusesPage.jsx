import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Users,
  Compass,
  Navigation,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import { getMajorBusJunctions } from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';

export default function BusesPage() {
  const { busSchedules, journeys } = useMobility();
  const [operatorFilter, setOperatorFilter] = useState('all');

  const junctions = getMajorBusJunctions(busSchedules, journeys);

  const filteredBuses = busSchedules.filter((bus) => {
    if (operatorFilter === 'all') return true;
    if (operatorFilter === 'ksrtc') return (bus.operator || '').includes('KSRTC');
    if (operatorFilter === 'private') return !(bus.operator || '').includes('KSRTC');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Major Bus Junctions & Public Transit Tracking
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            Multi-Modal Hub
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          SANCHAARI coordinates first-mile community rides to deliver students safely to designated major bus junctions for seamless public transit continuation.
        </p>
      </div>

      {/* Mandatory Demo / Simulated Data Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block">
            Notice: Simulated Public Bus Transit Data (KSRTC & Private Feed Demo)
          </strong>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            The bus departure schedules, junction telemetry, and delay minutes below represent high-fidelity <strong>simulated demo data</strong> calibrated to Kozhikode rural bus corridors (Route 42, 14, 108, 18, 88). In production, this module interfaces directly with KSRTC Open Transit Data API and Kerala Motor Vehicles Department (MVD) GPS streams.
          </p>
        </div>
      </div>

      {/* Visual Multi-Modal Corridor Journey Pipeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Integrated Multi-Modal Transportation Pipeline
            </h3>
            <p className="text-[11px] text-slate-500">
              How SANCHAARI bridges first-mile gaps to major government bus lines
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Active Workflow
          </span>
        </div>

        {/* 5-Step Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative text-center space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 1</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-800 block">Student Pickup</strong>
            <p className="text-[11px] text-slate-500">Rural Village Stop / Home Bay</p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 relative text-center space-y-1.5">
            <span className="text-[10px] font-bold text-blue-600 uppercase">Phase 2</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-xs shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Community Vehicle</strong>
            <p className="text-[11px] text-slate-600">Auto, Van, or Parent Carpool</p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 relative text-center space-y-1.5">
            <span className="text-[10px] font-bold text-purple-600 uppercase">Phase 3</span>
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white mx-auto flex items-center justify-center font-bold text-xs shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Major Bus Junction</strong>
            <p className="text-[11px] text-slate-600">Kunnamangalam / Mavoor Hub</p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 relative text-center space-y-1.5">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Phase 4</span>
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white mx-auto flex items-center justify-center font-bold text-xs shadow-xs">
              <Bus className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">Government Bus</strong>
            <p className="text-[11px] text-slate-600">KSRTC Ordinary / Fast Transit</p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 relative text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Phase 5</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-slate-900 block">College Campus</strong>
            <p className="text-[11px] text-slate-600">GECK / REC Campus Gate</p>
          </div>
        </div>
      </div>

      {/* Major Bus Junctions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Designated Multi-Modal Transfer Junctions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {junctions.map((jnc) => (
            <div
              key={jnc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{jnc.name}</h4>
                  <p className="text-[11px] text-slate-500">{jnc.corridor}</p>
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    jnc.statusColor === 'rose'
                      ? 'bg-rose-500 animate-ping'
                      : jnc.statusColor === 'blue'
                      ? 'bg-blue-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Connected Students:</span>
                  <strong className="text-blue-700 font-bold">{jnc.connectedStudents} Pax</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Upcoming Buses:</span>
                  <span className="font-semibold text-slate-800">{jnc.upcomingBusesCount} buses</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Corridor Status:</span>
                  <span
                    className={`font-semibold ${
                      jnc.statusColor === 'rose' ? 'text-rose-700' : 'text-slate-700'
                    }`}
                  >
                    {jnc.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 font-mono truncate">
                GPS: {jnc.gpsCoordinates}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Departure Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Government & Private Bus Corridor Schedules
            </h3>
            <p className="text-[11px] text-slate-500">
              Tracking scheduled departures, delays, and community backup status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white"
            >
              <option value="all">All Operators</option>
              <option value="ksrtc">KSRTC Government Buses</option>
              <option value="private">Private Transit</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Route & Line</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Key Stops</th>
                <th className="py-3 px-4">Scheduled Departure</th>
                <th className="py-3 px-4 text-center">Delay</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Community Backup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {bus.routeNumber}
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{bus.name}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{bus.operator}</td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-[200px] truncate">
                    {bus.connectingStops.join(' → ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {bus.nextScheduledDeparture}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {bus.delayMinutes > 0 ? (
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                        +{bus.delayMinutes} mins
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        On Time
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        bus.statusType === 'danger'
                          ? 'bg-rose-100 text-rose-800'
                          : bus.statusType === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bus.currentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {bus.hasCommunityBackup ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Autos Staged</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
