import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  MapPin,
  Compass,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileText,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useMobility } from '../../context/MobilityContext';
import { validateTransportationRequest } from '../../services/studentService';

const PRESET_VILLAGES = [
  'Kunnamangalam Hub',
  'Mavoor Road',
  'Karanthur Junction',
  'Kuttikkattoor',
  'Chathamangalam',
  'Balussery Ghat',
  'Palayam Central',
  'Koduvally',
];

const PRESET_JUNCTIONS = [
  'Kunnamangalam Bus Hub (Route 42/14/18)',
  'Mavoor Road Bus Bay (Route 42)',
  'Medical College Terminus (Route 14/108)',
  'GECK Campus Gate Bay (Route 18)',
  'NIT Calicut Main Bay',
];

const PRESET_DESTINATIONS = [
  'Govt. Engineering College Kozhikode (GECK)',
  'NIT Calicut Campus Gate',
  'Govt. Medical College Kozhikode',
  'Calicut University Campus',
  'Farook College Junction',
];

export default function RequestForm() {
  const navigate = useNavigate();
  const { createJourneyRequest, studentProfile, disruptions } = useMobility();

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    studentName: studentProfile?.name || 'Aarav Sharma',
    villageName: 'Kunnamangalam Hub',
    pickupLocation: 'Kunnamangalam Bus Bay Platform 2',
    destinationCollege: 'Govt. Engineering College Kozhikode (GECK)',
    preferredJunction: 'Kunnamangalam Bus Hub (Route 42/14/18)',
    requiredArrivalTime: '08:30 AM',
    travelDate: todayStr,
    passengers: 1,
    urgency: 'High',
    notes: 'Carrying laptop and project kit; preferred pickup near auto stand.',
    busNumber: 'Route 42',
  });

  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeDisruptions = disruptions.filter((d) => d.status === 'Active');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    const validation = validateTransportationRequest(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        studentName: formData.studentName,
        village: formData.villageName,
        pickupLocation: formData.pickupLocation,
        destinationLocation: formData.destinationCollege,
        preferredJunction: formData.preferredJunction,
        scheduledTime: `${formData.travelDate}, ${formData.requiredArrivalTime}`,
        travelDate: formData.travelDate,
        passengers: parseInt(formData.passengers, 10),
        urgency: formData.urgency,
        notes: formData.notes,
        onwardBusDetails: formData.busNumber
          ? {
              busNumber: formData.busNumber,
              disruptedAt: activeDisruptions[0]?.affectedSegment || null,
              expectedDelay: activeDisruptions[0]?.estimatedResolution || 'Normal Schedule',
              severity: activeDisruptions[0]?.severity || 'Medium',
            }
          : null,
      };

      const newId = await createJourneyRequest(payload);
      setShowConfirmModal(false);
      setIsSubmitting(false);

      // Navigate directly to journey details page
      navigate(`/student/journeys/${newId}`);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Disruption Warning Alert */}
      {activeDisruptions.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">
              Active Transit Disruption: {activeDisruptions[0].routeNumber} (
              {activeDisruptions[0].affectedSegment})
            </strong>
            <p className="text-amber-800 mt-0.5 text-[11px] leading-relaxed">
              {activeDisruptions[0].advice} • Community autos and carpools are prioritized for this corridor.
            </p>
          </div>
        </div>
      )}

      {/* Main Request Form */}
      <form
        onSubmit={handlePreSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">
              Student Ride Request Details
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in your pickup village and required arrival time. The AI matching engine will allocate verified community vehicles automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Student Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Student Name *</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Your full name"
            />
            {errors.studentName && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.studentName}</span>
            )}
          </div>

          {/* Village Name */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Origin Village / Rural Hub *</label>
            <select
              value={formData.villageName}
              onChange={(e) => handleChange('villageName', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              {PRESET_VILLAGES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            {errors.villageName && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.villageName}</span>
            )}
          </div>

          {/* Pickup Location */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Pickup Location *</label>
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) => handleChange('pickupLocation', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. Near Kunnamangalam Auto Stand / Bus Stop"
            />
            {errors.pickupLocation && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.pickupLocation}</span>
            )}
          </div>

          {/* Destination College */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Destination College / Campus *</label>
            <select
              value={formData.destinationCollege}
              onChange={(e) => handleChange('destinationCollege', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              {PRESET_DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.destinationCollege && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.destinationCollege}</span>
            )}
          </div>

          {/* Preferred Major Bus Junction */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Preferred Transfer Bus Junction</label>
            <select
              value={formData.preferredJunction}
              onChange={(e) => handleChange('preferredJunction', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              {PRESET_JUNCTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Date */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Travel Date *</label>
            <input
              type="date"
              value={formData.travelDate}
              min={todayStr}
              onChange={(e) => handleChange('travelDate', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.travelDate && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.travelDate}</span>
            )}
          </div>

          {/* Required Arrival Time */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Required Arrival Time *</label>
            <input
              type="text"
              value={formData.requiredArrivalTime}
              onChange={(e) => handleChange('requiredArrivalTime', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. 08:30 AM or Immediate"
            />
            {errors.requiredArrivalTime && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.requiredArrivalTime}</span>
            )}
          </div>

          {/* Passenger Count */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Number of Passengers (1-6) *</label>
            <input
              type="number"
              min="1"
              max="6"
              value={formData.passengers}
              onChange={(e) => handleChange('passengers', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.passengers && (
              <span className="text-rose-600 text-[11px] font-semibold">{errors.passengers}</span>
            )}
          </div>

          {/* Urgency */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Urgency Level</label>
            <select
              value={formData.urgency}
              onChange={(e) => handleChange('urgency', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="High">High (Urgent Breakdown / Exam on Time)</option>
              <option value="Medium">Medium (Scheduled Bus Missed)</option>
              <option value="Low">Low (Routine Return Carpool)</option>
            </select>
          </div>

          {/* Disrupted Bus Number (Optional) */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Connecting / Disrupted Bus Route</label>
            <input
              type="text"
              value={formData.busNumber}
              onChange={(e) => handleChange('busNumber', e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. Route 42 or Route 14"
            />
          </div>
        </div>

        {/* Additional Instructions / Notes */}
        <div className="space-y-1 text-xs">
          <label className="block font-bold text-slate-700">
            Additional Instructions / Landmark Details (Optional)
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
            placeholder="e.g. Waiting near Kerala Bank ATM; carrying group project box..."
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Estimated Fare: <strong className="text-emerald-700">₹{(formData.passengers || 1) * 25} (Subsidized Community Pool)</strong>
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 transition hover:scale-102"
          >
            <Send className="w-4 h-4" />
            <span>Review & Submit Request</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal Before Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirm Ride Request
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Verify journey specifications before dispatching
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-800">{formData.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Stop:</span>
                  <strong className="text-slate-800">{formData.pickupLocation}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <strong className="text-slate-800">{formData.destinationCollege}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transfer Junction:</span>
                  <span className="font-semibold text-slate-700">{formData.preferredJunction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Travel Timing:</span>
                  <strong className="text-slate-800">{formData.travelDate} at {formData.requiredArrivalTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passengers:</span>
                  <strong className="text-emerald-700">{formData.passengers} Pax</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Visibility in Community & Admin Portals</span>
                </div>
                <p>
                  Upon confirmation, Member 2’s AI matching engine will identify the nearest verified auto or carpool van.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Edit Form
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmedSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                {isSubmitting ? 'Submitting Request...' : 'Confirm & Request Ride'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
