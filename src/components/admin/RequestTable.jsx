import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  User,
  MapPin,
  Car,
  Clock,
  CheckCircle,
  X,
  Phone,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getRequestStatusBadge, formatAdminTime, exportToCSV } from '../../utils/adminHelpers';

export default function RequestTable({ requests = [], onSelectRequest }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Extract unique villages
  const villages = useMemo(() => {
    const set = new Set();
    requests.forEach((r) => {
      const v = r.village || (r.pickupLocation ? r.pickupLocation.split(' ')[0] : 'Kunnamangalam');
      if (v) set.add(v);
    });
    return Array.from(set);
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        !searchTerm ||
        (req.studentName && req.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.pickupLocation && req.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.destinationLocation && req.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()));

      const village = req.village || (req.pickupLocation ? req.pickupLocation.split(' ')[0] : '');
      const matchesVillage = villageFilter === 'all' || village.toLowerCase().includes(villageFilter.toLowerCase());

      const status = req.status || 'requested';
      let matchesStatus = statusFilter === 'all';
      if (statusFilter === 'pending') matchesStatus = status === 'requested' || status === 'pending';
      else if (statusFilter === 'assigned') matchesStatus = status === 'matched' || status === 'assigned';
      else if (statusFilter === 'in-progress') matchesStatus = status === 'in-progress';
      else if (statusFilter === 'completed') matchesStatus = status === 'completed';
      else if (statusFilter === 'unallocated') matchesStatus = status === 'unallocated';

      return matchesSearch && matchesVillage && matchesStatus;
    });
  }, [requests, searchTerm, villageFilter, statusFilter]);

  const handleExport = () => {
    const exportData = filteredRequests.map((r) => ({
      'Request ID': r.id,
      'Student Name': r.studentName,
      'Village': r.village || r.pickupLocation,
      'Pickup Location': r.pickupLocation,
      'Destination': r.destinationLocation,
      'Preferred Junction': r.preferredJunction || '--',
      'Scheduled Time': r.scheduledTime,
      'Passengers': r.passengers || 1,
      'Status': r.status,
      'Assigned Vehicle': r.matchedVehicle?.vehicleNumber || 'Unassigned',
      'Driver Name': r.matchedVehicle?.driverName || '--',
    }));
    exportToCSV(exportData, `sanchaari_student_requests_${Date.now()}.csv`);
  };

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    if (onSelectRequest) onSelectRequest(req);
  };

  return (
    <div className="space-y-4">
      {/* Controls & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID, pickup or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Village Filter */}
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Villages / Origins</option>
            {villages.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses ({requests.length})</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">On Trip</option>
            <option value="completed">Completed</option>
            <option value="unallocated">Unallocated / Stranded</option>
          </select>

          {/* CSV Export Button */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Village / Pickup</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Junction</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-center">Pax</th>
                <th className="py-3.5 px-4">Assigned Vehicle</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No student requests match your search criteria.</p>
                    <p className="text-xs mt-1">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const badge = getRequestStatusBadge(req.status);
                  const isUnallocated = req.status === 'unallocated';

                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        isUnallocated ? 'bg-rose-50/30' : ''
                      }`}
                      onClick={() => handleRowClick(req)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.studentName}</div>
                        <div className="text-[10px] text-slate-400">{req.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {req.village || req.pickupLocation?.split(' ')[0]}
                        </span>
                        <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {req.pickupLocation}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 truncate max-w-[150px]">
                        {req.destinationLocation}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {req.preferredJunction || '--'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {req.scheduledTime || formatAdminTime(req.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {req.passengers || 1}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.matchedVehicle ? (
                          <div>
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {req.matchedVehicle.vehicleNumber}
                            </span>
                            <p className="text-[10px] text-slate-500 truncate">
                              {req.matchedVehicle.driverName}
                            </p>
                          </div>
                        ) : (
                          <span className={`text-[11px] font-semibold ${isUnallocated ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                            {isUnallocated ? '⚠ No Vehicle' : 'Searching...'}
                          </span>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(req);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> total requests
          </span>
          <span className="text-[11px]">
            Unallocated Queue:{' '}
            <strong className="text-rose-600">
              {requests.filter((r) => r.status === 'unallocated').length}
            </strong>
          </span>
        </div>
      </div>

      {/* Request Details Modal / Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {selectedRequest.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedRequest.studentName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Student ID: {selectedRequest.studentId} • Urgency: {selectedRequest.urgency}
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Journey Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Pickup Point
                </span>
                <p className="font-bold text-slate-800 text-sm">{selectedRequest.pickupLocation}</p>
                <p className="text-slate-500 text-[11px]">Village: {selectedRequest.village || '--'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Destination Point
                </span>
                <p className="font-bold text-slate-800 text-sm">{selectedRequest.destinationLocation}</p>
                <p className="text-slate-500 text-[11px]">
                  Preferred Junction: {selectedRequest.preferredJunction || '--'}
                </p>
              </div>
            </div>

            {/* Assigned Vehicle Information */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Assigned Community Vehicle</span>
              </h4>

              {selectedRequest.matchedVehicle ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-blue-700/80 text-[10px] block">Driver</span>
                    <strong className="text-slate-900">{selectedRequest.matchedVehicle.driverName}</strong>
                    <p className="text-slate-500 text-[11px]">{selectedRequest.matchedVehicle.driverPhone}</p>
                  </div>
                  <div>
                    <span className="text-blue-700/80 text-[10px] block">Vehicle</span>
                    <strong className="text-slate-900">{selectedRequest.matchedVehicle.vehicleNumber}</strong>
                    <p className="text-slate-500 text-[11px]">{selectedRequest.matchedVehicle.vehicleType}</p>
                  </div>
                  <div>
                    <span className="text-blue-700/80 text-[10px] block">ETA & Location</span>
                    <strong className="text-emerald-700">{selectedRequest.matchedVehicle.eta || 'Active'}</strong>
                    <p className="text-slate-500 text-[10px] truncate">{selectedRequest.matchedVehicle.liveLocation}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>No vehicle currently assigned.</strong> This request is currently in the matching pool awaiting driver acceptance or alternative community vehicle availability.
                </div>
              )}
            </div>

            {/* Onward Bus Details (if any) */}
            {selectedRequest.onwardBusDetails && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-2">
                <h4 className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                  Public Transit Link / Disrupted Route Connection
                </h4>
                <div className="flex flex-wrap gap-4 text-slate-700">
                  <div>
                    <span className="text-purple-700 text-[10px] block">Bus Corridor:</span>
                    <strong>{selectedRequest.onwardBusDetails.busNumber}</strong>
                  </div>
                  {selectedRequest.onwardBusDetails.disruptedAt && (
                    <div>
                      <span className="text-purple-700 text-[10px] block">Disrupted At:</span>
                      <strong>{selectedRequest.onwardBusDetails.disruptedAt}</strong>
                    </div>
                  )}
                  {selectedRequest.onwardBusDetails.expectedDelay && (
                    <div>
                      <span className="text-purple-700 text-[10px] block">Delay:</span>
                      <strong className="text-rose-700">{selectedRequest.onwardBusDetails.expectedDelay}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Journey Tracking Progress */}
            {selectedRequest.trackingSteps && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Journey Timeline Steps
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedRequest.trackingSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.done ? '✓' : step.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-800">{step.label}</strong>
                          <span className="text-slate-400 font-mono text-[10px]">{step.time}</span>
                        </div>
                        {step.desc && <p className="text-slate-500 text-[11px] mt-0.5">{step.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
