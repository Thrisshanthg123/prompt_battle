import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Car,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  User,
  Users,
  CheckCircle,
  X,
  Phone,
  Clock,
  MapPin,
  RotateCw,
  Power,
  Wrench,
} from 'lucide-react';
import { getVehicleStatusBadge, exportToCSV } from '../../utils/adminHelpers';

export default function VehicleTable({
  vehicles = [],
  requests = [],
  onSimulateBreakdown,
  onRepairVehicle,
  onToggleStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Extract unique vehicle types
  const vehicleTypes = useMemo(() => {
    const set = new Set();
    vehicles.forEach((v) => {
      if (v.vehicleType) set.add(v.vehicleType);
    });
    return Array.from(set);
  }, [vehicles]);

  // Compute assigned students per vehicle
  const assignedStudentsMap = useMemo(() => {
    const map = new Map();
    vehicles.forEach((v) => map.set(v.id, []));

    requests.forEach((req) => {
      if (
        req.matchedVehicle?.id &&
        (req.status === 'matched' || req.status === 'in-progress' || req.status === 'assigned')
      ) {
        const list = map.get(req.matchedVehicle.id) || [];
        list.push(req);
        map.set(req.matchedVehicle.id, list);
      }
    });
    return map;
  }, [vehicles, requests]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        !searchTerm ||
        (v.driverName && v.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.id && v.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.baseLocation && v.baseLocation.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'all' || v.vehicleType === typeFilter;
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

      let matchesVerification = true;
      if (verificationFilter === 'verified') matchesVerification = v.verified === true;
      else if (verificationFilter === 'unverified') matchesVerification = v.verified === false;

      return matchesSearch && matchesType && matchesStatus && matchesVerification;
    });
  }, [vehicles, searchTerm, typeFilter, statusFilter, verificationFilter]);

  const handleExport = () => {
    const data = filteredVehicles.map((v) => ({
      'Vehicle ID': v.id,
      'Owner / Driver': v.driverName,
      'Phone': v.driverPhone,
      'Vehicle Type': v.vehicleType,
      'Registration': v.vehicleNumber,
      'Current Location': v.baseLocation || '--',
      'Destination': v.destination || '--',
      'Departure Time': v.departureTime || '--',
      'Capacity': v.capacity,
      'Available Seats': v.availableSeats,
      'Verified': v.verified ? 'Yes' : 'No',
      'Status': v.status,
      'Assigned Students': (assignedStudentsMap.get(v.id) || []).length,
    }));
    exportToCSV(data, `sanchaari_community_fleet_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Controls & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by driver name, plate number, base location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Vehicle Types</option>
            {vehicleTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses ({vehicles.length})</option>
            <option value="available">Available</option>
            <option value="on-trip">On Trip / Assigned</option>
            <option value="breakdown">Breakdown</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Ineligible / Pending</option>
          </select>

          {/* Export */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Vehicle ID</th>
                <th className="py-3.5 px-4">Driver & Contact</th>
                <th className="py-3.5 px-4">Type & Plate</th>
                <th className="py-3.5 px-4">Current Hub / Route</th>
                <th className="py-3.5 px-4">Departure</th>
                <th className="py-3.5 px-4 text-center">Capacity</th>
                <th className="py-3.5 px-4 text-center">Available Seats</th>
                <th className="py-3.5 px-4">Assigned Students</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No vehicles match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => {
                  const badge = getVehicleStatusBadge(v.status, v.verified);
                  const assignedStudents = assignedStudentsMap.get(v.id) || [];
                  const isBreakdown = v.status === 'breakdown';
                  const isLowSeats = v.status === 'available' && v.availableSeats <= 1;

                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isBreakdown ? 'bg-rose-50/40' : ''
                      }`}
                      onClick={() => setSelectedVehicle(v)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {v.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{v.driverName}</span>
                          {v.verified ? (
                            <span title="Verified Community Driver">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            </span>
                          ) : (
                            <span title="Unverified Vehicle (Cannot match)">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{v.driverPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{v.vehicleType}</div>
                        <div className="font-mono text-[10px] text-slate-500">{v.vehicleNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{v.baseLocation}</span>
                        <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                          → {v.destination || 'Campus Corridor'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {v.departureTime || 'On Demand'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {v.capacity}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            v.availableSeats === 0
                              ? 'bg-slate-100 text-slate-600'
                              : isLowSeats
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {v.availableSeats}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {assignedStudents.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              {assignedStudents.length} student{assignedStudents.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {isBreakdown ? (
                            <button
                              onClick={() => onRepairVehicle && onRepairVehicle(v.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition"
                              title="Mark breakdown repaired and return to service"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Repair</span>
                            </button>
                          ) : assignedStudents.length > 0 ? (
                            <button
                              onClick={() => onSimulateBreakdown && onSimulateBreakdown(v.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition"
                              title="Simulate vehicle breakdown & auto reallocate students"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Breakdown</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleStatus && onToggleStatus(v.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                            >
                              {v.status === 'available' ? 'Set Offline' : 'Set Active'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total Fleet: <strong>{vehicles.length}</strong> • Verified Active:{' '}
            <strong className="text-emerald-700">
              {vehicles.filter((v) => v.status === 'available' && v.verified).length}
            </strong>
          </span>
          <span>
            Vehicles in Breakdown:{' '}
            <strong className="text-rose-600">
              {vehicles.filter((v) => v.status === 'breakdown').length}
            </strong>
          </span>
        </div>
      </div>

      {/* Vehicle Details Drawer / Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedVehicle.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedVehicle.driverName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedVehicle.vehicleType} • {selectedVehicle.vehicleNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                  Capacity & Available Seats
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedVehicle.availableSeats} of {selectedVehicle.capacity} seats available
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                  Verification Status
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {selectedVehicle.verified ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Govt & RTO Verified</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Ineligible (Unverified)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                  Driver Phone
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedVehicle.driverPhone}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                  Rating & Completed Trips
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  ★ {selectedVehicle.rating} ({selectedVehicle.totalTrips || 120} trips)
                </p>
              </div>
            </div>

            {/* Assigned Students List */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Students Assigned to this Vehicle</span>
                <span className="text-blue-600 font-bold">
                  {(assignedStudentsMap.get(selectedVehicle.id) || []).length} active
                </span>
              </h4>

              {(assignedStudentsMap.get(selectedVehicle.id) || []).length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                  No students currently assigned to this vehicle.
                </div>
              ) : (
                <div className="space-y-2">
                  {(assignedStudentsMap.get(selectedVehicle.id) || []).map((stu) => (
                    <div
                      key={stu.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-slate-900">{stu.studentName}</strong>
                        <p className="text-[11px] text-slate-500">
                          {stu.pickupLocation} → {stu.destinationLocation}
                        </p>
                      </div>
                      <span className="font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                        {stu.passengers || 1} Pax
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {selectedVehicle.status === 'breakdown' ? (
                <button
                  onClick={() => {
                    onRepairVehicle && onRepairVehicle(selectedVehicle.id);
                    setSelectedVehicle(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  Repair Vehicle & Return to Active Fleet
                </button>
              ) : (assignedStudentsMap.get(selectedVehicle.id) || []).length > 0 ? (
                <button
                  onClick={() => {
                    onSimulateBreakdown && onSimulateBreakdown(selectedVehicle.id);
                    setSelectedVehicle(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                >
                  Simulate Breakdown for this Vehicle
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">
                  No assigned students to trigger breakdown workflow
                </span>
              )}

              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
