import React from 'react';
import {
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  Compass,
  AlertTriangle,
  Check,
} from 'lucide-react';

const STANDARD_STEPS = [
  { id: 1, label: 'Request Submitted', desc: 'Journey registered in Community Mobility Coordinator' },
  { id: 2, label: 'Vehicle Assigned', desc: 'Verified community auto, van, or carpool confirmed' },
  { id: 3, label: 'Pickup Confirmed', desc: 'Driver arrived at pickup location' },
  { id: 4, label: 'On Trip', desc: 'Student en route via designated corridor' },
  { id: 5, label: 'Reached Major Bus Junction', desc: 'Connecting with onward government or campus bus' },
  { id: 6, label: 'Journey Completed', desc: 'Safe arrival verified by platform' },
];

export default function JourneyTimeline({ journey }) {
  if (!journey) return null;

  const isBreakdown = journey.status === 'unallocated';
  const isCompleted = journey.status === 'completed';
  const isOnTrip = journey.status === 'in-progress';
  const isMatched = journey.status === 'matched';

  // Determine current active step index (1-6)
  let activeStepIndex = 1;
  if (isCompleted) activeStepIndex = 6;
  else if (isOnTrip) activeStepIndex = 4;
  else if (isMatched) activeStepIndex = 2;

  // Use trackingSteps from journey object if available, otherwise standard steps
  const stepsToRender = journey.trackingSteps && journey.trackingSteps.length >= 5
    ? journey.trackingSteps
    : STANDARD_STEPS.map((s) => ({
        ...s,
        done: s.id <= activeStepIndex,
        time: s.id === 1 ? '08:15 AM' : s.id <= activeStepIndex ? 'Active' : '--',
      }));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Journey Progress Tracker
          </h3>
          <p className="text-xs text-slate-500">
            Real-time status updates broadcast directly to your student portal
          </p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            isBreakdown
              ? 'bg-rose-100 text-rose-800 animate-pulse'
              : isCompleted
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {isBreakdown ? 'Reallocation Queue' : isCompleted ? 'Trip Finished' : 'In Progress'}
        </span>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {stepsToRender.map((step, idx) => {
          const isDone = step.done || idx + 1 <= activeStepIndex;
          const isCurrent = idx + 1 === activeStepIndex && !isCompleted;

          return (
            <div key={step.id || idx} className="relative group">
              {/* Stepper Node Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4
                    className={`text-xs font-bold leading-tight ${
                      isDone ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {step.time || '--'}
                  </span>
                </div>
                {step.desc && (
                  <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
