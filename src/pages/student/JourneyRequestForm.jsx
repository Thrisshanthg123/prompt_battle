import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, MapPin, Users, AlertCircle, Sparkles, Clock, Check, Bus } from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';

export default function JourneyRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};

  const { createJourneyRequest, studentProfile, disruptions, busSchedules } = useMobility();

  const [formData, setFormData] = useState({
    pickupLocation: navState.pickupLocation || 'Mavoor Road Bus Stand',
    destinationLocation: navState.destinationLocation || studentProfile.collegeStop || 'GECK Campus Main Gate',
    reason: navState.reason || 'Public Bus Breakdown (Route #42)',
    urgency: navState.urgency || 'High',
    passengers: navState.passengers || 1,
    scheduledTime: 'Immediate (Next 10 mins)',
    busNumber: navState.busNumber || 'Route 42',
    notes: navState.notes || 'Stranded near platform 3 following bus engine breakdown.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetLocations = [
    'Mavoor Road Bus Stand',
    'Kunnamangalam Bus Bay',
    'GECK Campus Main Gate',
    'Calicut Central Railway Station',
    'Medical College Junction',
    'Palayam Bus Stand',
    'Karanthur Town',
  ];

  const reasonOptions = [
    { label: 'Public Bus Breakdown / Stranded', defaultUrgency: 'High' },
    { label: 'Missed Scheduled Connecting Bus', defaultUrgency: 'Medium' },
    { label: 'First-Mile Remote Stop Access', defaultUrgency: 'Medium' },
    { label: 'Last-Mile Campus Transit Gap', defaultUrgency: 'Low' },
    { label: 'Late Evening Safety Ride', defaultUrgency: 'High' },
  ];

  const handleReasonChange = (newReason) => {
    const selected = reasonOptions.find((r) => r.label === newReason);
    setFormData((prev) => ({
      ...prev,
      reason: newReason,
      urgency: selected ? selected.defaultUrgency : prev.urgency,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      pickupLocation: formData.pickupLocation,
      destinationLocation: formData.destinationLocation,
      reason: formData.reason,
      urgency: formData.urgency,
      passengers: parseInt(formData.passengers, 10),
      scheduledTime: formData.scheduledTime,
      notes: formData.notes,
      onwardBusDetails: formData.busNumber
        ? {
            busNumber: formData.busNumber,
            reason: formData.reason,
          }
        : null,
    };

    const newJourneyId = await createJourneyRequest(payload);
    setIsSubmitting(false);

    // Navigate to tracking
    navigate(`/tracking/${newJourneyId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Request Community Ride</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            AI Matching Active
          </span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stranded by a bus breakdown or facing a transit gap? Connect with verified community autos, carpools, and campus vans.
        </p>
      </div>

      {/* Disruption Alert Context */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Active Public Transit Advisory</p>
          <p className="text-amber-800">
            Route 42 breakdown currently active at Mavoor Road. Verified autos and college carpool vans have been placed on standby.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Origin & Destination */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pickup Location (Where are you right now?)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blue-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="Enter landmark or bus stop name"
              />
            </div>
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Quick pick:</span>
              {presetLocations.slice(0, 3).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setFormData({ ...formData, pickupLocation: loc })}
                  className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Destination Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.destinationLocation}
                onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="Enter college campus, railway station, or transit hub"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Quick pick:</span>
              {presetLocations.slice(2, 5).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setFormData({ ...formData, destinationLocation: loc })}
                  className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reason for Request & Connected Bus Route */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Request
            </label>
            <select
              value={formData.reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition"
            >
              {reasonOptions.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Associated Bus Line (If applicable)
            </label>
            <div className="relative">
              <Bus className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="e.g. Route 42 or KSRTC Fast"
              />
            </div>
          </div>
        </div>

        {/* Urgency & Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((urg) => (
                <button
                  type="button"
                  key={urg}
                  onClick={() => setFormData({ ...formData, urgency: urg })}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    formData.urgency === urg
                      ? urg === 'High'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Number of Passengers
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition"
              >
                <option value="1">1 Student (Individual)</option>
                <option value="2">2 Students (Carpool Pair)</option>
                <option value="3">3 Students (Group Carpool)</option>
                <option value="4">4 Students (Full Auto / Van Share)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Special Notes / Landmark Description
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="e.g. Waiting near Gate 2, carrying college laptop bag..."
          />
        </div>

        {/* Subsidized Community Fare Estimate */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-900">Community Coordinated Fare Share</p>
            <p className="text-[11px] text-emerald-700">Subsidized student rate with volunteer driver backing</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-emerald-900">
              ₹{formData.passengers * 25}
            </span>
            <span className="text-[10px] text-emerald-700 block">(₹25 per student)</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Broadcasting to Community Vehicles...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Broadcast Request & Match Vehicle</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
