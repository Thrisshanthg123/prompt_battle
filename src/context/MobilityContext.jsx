
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_JOURNEYS,
  INITIAL_VEHICLES,
  INITIAL_DISRUPTIONS,
  INITIAL_BUS_SCHEDULES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ALLOCATIONS,
} from './mockData';

import { matchJourneyRequest } from '../services/matchingEngineInterface';

import { broadcastDisruption } from '../services/disruptionEngineInterface';

import {
  handleVehicleBreakdown as runDisruptionWorkflow,
  resolveVehicleBreakdown,
} from '../services/disruptionService';

const MobilityContext = createContext(null);

// --------------------------------------------------
// SAFE LOCAL STORAGE
// --------------------------------------------------

const loadData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return fallback;
  }
};

// --------------------------------------------------
// MOBILITY PROVIDER
// --------------------------------------------------

export function MobilityProvider({ children }) {
  // --------------------------------------------------
  // APPLICATION STATE
  // --------------------------------------------------

  const [studentProfile, setStudentProfile] = useState(() =>
    loadData('sanchaari_student', DEFAULT_STUDENT_PROFILE)
  );

  const [journeys, setJourneys] = useState(() =>
    loadData('sanchaari_journeys', INITIAL_JOURNEYS)
  );

  const [vehicles, setVehicles] = useState(() =>
    loadData('sanchaari_vehicles', INITIAL_VEHICLES)
  );

  const [allocations, setAllocations] = useState(() =>
    loadData('sanchaari_allocations', INITIAL_ALLOCATIONS)
  );

  const [disruptions, setDisruptions] = useState(() =>
    loadData('sanchaari_disruptions', INITIAL_DISRUPTIONS)
  );

  const [busSchedules, setBusSchedules] = useState(() =>
    loadData('sanchaari_buses', INITIAL_BUS_SCHEDULES)
  );

  const [activityLogs, setActivityLogs] = useState(() =>
    loadData('sanchaari_activity_logs', INITIAL_ACTIVITY_LOGS)
  );

  const [lastDisruptionResult, setLastDisruptionResult] = useState(() =>
    loadData('sanchaari_last_disruption', null)
  );

  const [activeAlert, setActiveAlert] = useState(null);

  // --------------------------------------------------
  // LOCAL STORAGE PERSISTENCE
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_student',
      JSON.stringify(studentProfile)
    );
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_journeys',
      JSON.stringify(journeys)
    );
  }, [journeys]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_vehicles',
      JSON.stringify(vehicles)
    );
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_allocations',
      JSON.stringify(allocations)
    );
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_disruptions',
      JSON.stringify(disruptions)
    );
  }, [disruptions]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_buses',
      JSON.stringify(busSchedules)
    );
  }, [busSchedules]);

  useEffect(() => {
    localStorage.setItem(
      'sanchaari_activity_logs',
      JSON.stringify(activityLogs)
    );
  }, [activityLogs]);

  useEffect(() => {
    if (lastDisruptionResult) {
      localStorage.setItem(
        'sanchaari_last_disruption',
        JSON.stringify(lastDisruptionResult)
      );
    } else {
      localStorage.removeItem('sanchaari_last_disruption');
    }
  }, [lastDisruptionResult]);

  // --------------------------------------------------
  // ALERT SYSTEM
  // --------------------------------------------------

  const showAlert = (message, type = 'success') => {
    setActiveAlert({ message, type });

    setTimeout(() => {
      setActiveAlert(null);
    }, 4500);
  };

  // --------------------------------------------------
  // ACTIVITY LOGGING - MEMBER 3
  // --------------------------------------------------

  const addActivityLog = (logItem) => {
    const newLog = {
      id: logItem.id || `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: logItem.timestamp || new Date().toISOString(),
      type: logItem.type || 'info',
      title: logItem.title || 'System Event',
      description: logItem.description || '',
      severity: logItem.severity || 'info',
    };

    setActivityLogs((previous) => [newLog, ...previous]);
  };

  // --------------------------------------------------
  // UPDATE REQUEST HELPER
  // --------------------------------------------------

  const updateRequest = (requestId, updates) => {
    setJourneys((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, ...updates }
          : request
      )
    );
  };

  // --------------------------------------------------
  // UPDATE ALLOCATION HELPER
  // --------------------------------------------------

  const updateAllocation = (allocationId, updates) => {
    setAllocations((previous) =>
      previous.map((allocation) =>
        allocation.id === allocationId
          ? { ...allocation, ...updates }
          : allocation
      )
    );
  };

  // --------------------------------------------------
  // CREATE JOURNEY REQUEST - MEMBER 1
  // MEMBER 2 MATCHING ENGINE
  // --------------------------------------------------

  const createJourneyRequest = async (requestData) => {
    const newJourneyId =
      `JRN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const currentTimeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newJourney = {
      id: newJourneyId,

      studentId: studentProfile.id,
      studentName: studentProfile.name,

      village: requestData.village || 'Kunnamangalam',

      pickupLocation: requestData.pickupLocation,
      destinationLocation: requestData.destinationLocation,

      preferredJunction:
        requestData.preferredJunction || 'Kunnamangalam Bus Bay',

      scheduledTime: requestData.scheduledTime || 'Immediate',

      createdAt: new Date().toISOString(),

      reason:
        requestData.reason || 'General Transit Assistance',

      urgency: requestData.urgency || 'Medium',

      status: 'requested',

      passengers: parseInt(requestData.passengers, 10) || 1,

      fareShare: `₹${(Number(requestData.passengers) || 1) * 25} (Estimated Subsidized)`,

      notes: requestData.notes || '',

      onwardBusDetails: requestData.onwardBusDetails || null,

      matchedVehicle: null,

      trackingSteps: [
        {
          id: 1,
          label: 'Ride Requested',
          time: currentTimeStr,
          done: true,
          desc: 'Request queued in Community Mobility Hub',
        },
        {
          id: 2,
          label: 'AI Matching Engine Searching',
          time: 'Active',
          done: false,
          desc: 'Checking verified community vehicles',
        },
        {
          id: 3,
          label: 'Driver Arrived at Pickup',
          time: '--',
          done: false,
          desc: 'Pending driver assignment',
        },
        {
          id: 4,
          label: 'En Route to Destination',
          time: '--',
          done: false,
          desc: 'Journey underway',
        },
        {
          id: 5,
          label: 'Trip Completed',
          time: '--',
          done: false,
          desc: 'Safe arrival verification pending',
        },
      ],
    };

    // Save the journey request.
    setJourneys((previous) => [
      newJourney,
      ...previous,
    ]);

    addActivityLog({
      type: 'request',
      title: 'New Student Ride Requested',
      description: `${studentProfile.name} requested travel from ${requestData.pickupLocation}`,
      severity: 'info',
    });

    showAlert(
      `Journey request ${newJourneyId} submitted successfully!`
    );

    // Run the strict matching engine.
    try {
      const matchingResult = matchJourneyRequest(
        newJourney,
        vehicles,
        allocations
      );

      if (matchingResult.match) {
        const match = matchingResult.match;

        // Update available vehicle seats.
        setVehicles(matchingResult.updatedVehicles);

        // Store allocation records returned by the engine.
        setAllocations((previous) => [
          ...previous,
          ...matchingResult.allocations,
        ]);

        // Update journey with matched vehicle.
        setJourneys((previous) =>
          previous.map((journey) => {
            if (journey.id !== newJourneyId) {
              return journey;
            }

            return {
              ...journey,

              status: 'matched',

              matchedVehicle: match,

              assignedVehicleId: match.id,

              trackingSteps: journey.trackingSteps.map((step) => {
                if (step.id === 2) {
                  return {
                    ...step,

                    time: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),

                    done: true,

                    desc: `Matched with ${match.driverName} (${match.vehicleType})`,
                  };
                }

                return step;
              }),
            };
          })
        );

        addActivityLog({
          type: 'allocation',
          title: 'Auto Match Completed',
          description: `${studentProfile.name} matched with ${match.driverName} (${match.vehicleNumber})`,
          severity: 'success',
        });

        showAlert(
          `Community ride matched! Driver: ${match.driverName}`,
          'info'
        );
      } else {
        showAlert(
          'Request received. No eligible vehicle is currently available.',
          'warning'
        );
      }
    } catch (error) {
      console.error('Matching engine error:', error);

      showAlert(
        'Request saved, but matching could not be completed.',
        'warning'
      );
    }

    return newJourneyId;
  };

  // --------------------------------------------------
  // CANCEL JOURNEY - MEMBER 1
  // --------------------------------------------------

  const cancelJourney = (
    journeyId,
    cancelReason = 'Cancelled by student'
  ) => {
    const journey = journeys.find(
      (item) => item.id === journeyId
    );

    if (!journey || journey.status === 'cancelled') {
      return;
    }

    // Release reserved seats if the journey was matched.
    if (
      journey.status === 'matched' &&
      journey.assignedVehicleId
    ) {
      const allocation = allocations.find(
        (item) => item.requestId === journeyId
      );

      if (allocation) {
        setVehicles((previous) =>
          previous.map((vehicle) => {
            if (vehicle.id !== allocation.vehicleId) {
              return vehicle;
            }

            const restoredSeats =
              Number(vehicle.availableSeats) +
              Number(
                allocation.passengerCount ??
                allocation.passengers ??
                journey.passengers ??
                1
              );

            return {
              ...vehicle,
              availableSeats: Math.min(
                Number(vehicle.passengerCapacity),
                restoredSeats
              ),
              status: 'available',
            };
          })
        );

        setAllocations((previous) =>
          previous.filter(
            (item) => item.requestId !== journeyId
          )
        );
      }
    }

    setJourneys((previous) =>
      previous.map((item) => {
        if (item.id !== journeyId) {
          return item;
        }

        return {
          ...item,
          status: 'cancelled',
          cancelReason,
          trackingSteps: [
            ...item.trackingSteps,
            {
              id: 99,
              label: 'Journey Cancelled',
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              done: true,
              desc: cancelReason,
            },
          ],
        };
      })
    );

    addActivityLog({
      type: 'request',
      title: 'Journey Cancelled',
      description: `Journey ${journeyId} was cancelled: ${cancelReason}`,
      severity: 'warning',
    });

    showAlert(
      `Journey ${journeyId} was cancelled.`,
      'warning'
    );
  };

  // --------------------------------------------------
  // UPDATE JOURNEY STATUS
  // --------------------------------------------------

  const updateJourneyStatus = (journeyId, nextStatus) => {
    setJourneys((previous) =>
      previous.map((journey) => {
        if (journey.id !== journeyId) {
          return journey;
        }

        let updatedSteps = [
          ...journey.trackingSteps,
        ];

        const timeNow = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (nextStatus === 'in-progress') {
          updatedSteps = updatedSteps.map((step) => {
            if (step.id <= 4) {
              return {
                ...step,
                done: true,
                time: step.time === '--' ? timeNow : step.time,
              };
            }

            return step;
          });
        }

        if (nextStatus === 'completed') {
          updatedSteps = updatedSteps.map((step) => ({
            ...step,
            done: true,
            time: step.time === '--' ? timeNow : step.time,
          }));
        }

        return {
          ...journey,
          status: nextStatus,
          trackingSteps: updatedSteps,
        };
      })
    );

    addActivityLog({
      type: 'journey',
      title: 'Journey Status Updated',
      description: `Journey ${journeyId} updated to ${nextStatus}`,
      severity: 'info',
    });

    showAlert(
      `Journey ${journeyId} updated to: ${nextStatus}`
    );
  };

  // --------------------------------------------------
  // SOS ALERT
  // --------------------------------------------------

  const triggerSosAlert = (journeyId) => {
    const journey = journeys.find(
      (item) => item.id === journeyId
    );

    if (!journey) {
      showAlert('Journey not found.', 'warning');
      return;
    }

    addActivityLog({
      type: 'emergency',
      title: 'Emergency SOS Activated',
      description: `SOS activated for journey ${journeyId}`,
      severity: 'critical',
    });

    showAlert(
      `EMERGENCY SOS ACTIVATED! Alert dispatched to ${studentProfile.emergencyContact?.name || 'Emergency Contact'} (${studentProfile.emergencyContact?.phone || 'Phone unavailable'}) and Campus Security!`,
      'danger'
    );
  };

  // --------------------------------------------------
  // UPDATE STUDENT PROFILE
  // --------------------------------------------------

  const updateStudentProfile = (newProfileData) => {
    setStudentProfile((previous) => ({
      ...previous,
      ...newProfileData,
    }));

    showAlert('Profile updated successfully!');
  };

  // --------------------------------------------------
  // VEHICLE MANAGEMENT - MEMBER 2
  // --------------------------------------------------

  const addVehicle = (vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: vehicleData.id || `VEH-${Date.now()}`,
    };

    setVehicles((previous) => [
      newVehicle,
      ...previous,
    ]);

    showAlert('Community vehicle registered successfully!');

    return newVehicle.id;
  };

  const updateVehicle = (vehicleId, updates) => {
    setVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === vehicleId
          ? { ...vehicle, ...updates }
          : vehicle
      )
    );

    showAlert('Vehicle details updated successfully!');
  };

  const toggleVehicleAvailability = (
    vehicleId,
    isAvailable
  ) => {
    setVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              status: isAvailable ? 'available' : 'unavailable',
            }
          : vehicle
      )
    );

    showAlert('Vehicle availability updated.');
  };

  // --------------------------------------------------
  // VEHICLE BREAKDOWN AND REALLOCATION - MEMBER 3
  // --------------------------------------------------

  const simulateBreakdown = async (vehicleId, options = {}) => {
    try {
      const result = await runDisruptionWorkflow(
        vehicleId,
        {
          requests: journeys,
          vehicles,
          allocations,
        },
        options
      );

      // Update application state using workflow results.
      setVehicles(result.updatedVehicles);
      setJourneys(result.updatedRequests);

      setAllocations((previous) => [
        ...previous.filter(
          (allocation) => allocation.vehicleId !== vehicleId
        ),
        ...result.newAllocations,
      ]);

      setDisruptions((previous) => [
        result.disruptionRecord,
        ...previous,
      ]);

      if (result.activityLog) {
        addActivityLog(result.activityLog);
      }

      setLastDisruptionResult(result);

      const msg =
        result.summary.studentsUnallocated > 0
          ? `Breakdown handled! ${result.summary.studentsReassigned} students reassigned, ${result.summary.studentsUnallocated} unallocated.`
          : `Breakdown handled! All ${result.summary.studentsReassigned} students successfully reassigned.`;

      showAlert(
        msg,
        result.summary.studentsUnallocated > 0
          ? 'warning'
          : 'info'
      );

      return result;
    } catch (error) {
      console.error('Breakdown simulation error:', error);

      showAlert(
        `Error executing breakdown: ${error.message}`,
        'danger'
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // REPAIR VEHICLE - MEMBER 3
  // --------------------------------------------------

  const repairVehicle = (vehicleId) => {
    const updated = resolveVehicleBreakdown(
      vehicleId,
      vehicles
    );

    setVehicles(updated);

    addActivityLog({
      type: 'vehicle',
      title: 'Vehicle Repaired & Activated',
      description: `Vehicle ${vehicleId} marked repaired and returned to active fleet.`,
      severity: 'success',
    });

    showAlert(
      `Vehicle ${vehicleId} has been repaired and returned to service.`,
      'success'
    );
  };

  // --------------------------------------------------
  // DISRUPTION LOGGING - MEMBER 3
  // --------------------------------------------------

  const logDisruption = async (disruptionData) => {
    try {
      const result = await broadcastDisruption(disruptionData);

      if (result?.disruption) {
        setDisruptions((previous) => [
          result.disruption,
          ...previous,
        ]);

        addActivityLog({
          type: 'disruption',
          title: `Disruption: ${result.disruption.routeNumber}`,
          description: `${result.disruption.affectedSegment} - ${result.disruption.type}`,
          severity: 'critical',
        });

        showAlert(
          `Transit Disruption logged for ${result.disruption.routeNumber}`,
          'warning'
        );
      }

      return result;
    } catch (error) {
      console.error('Disruption logging error:', error);

      showAlert(
        'Unable to log the transit disruption.',
        'danger'
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // RESOLVE DISRUPTION - MEMBER 3
  // --------------------------------------------------

  const resolveDisruption = (disruptionId) => {
    setDisruptions((previous) =>
      previous.map((disruption) =>
        disruption.id === disruptionId
          ? { ...disruption, status: 'Resolved' }
          : disruption
      )
    );

    addActivityLog({
      type: 'disruption',
      title: 'Disruption Resolved',
      description: `Disruption ID ${disruptionId} marked as resolved.`,
      severity: 'success',
    });

    showAlert(
      `Disruption ${disruptionId} marked as resolved.`,
      'success'
    );
  };

  // --------------------------------------------------
  // RESET APPLICATION DATA
  // --------------------------------------------------

  const resetAllData = () => {
    localStorage.removeItem('sanchaari_student');
    localStorage.removeItem('sanchaari_journeys');
    localStorage.removeItem('sanchaari_vehicles');
    localStorage.removeItem('sanchaari_allocations');
    localStorage.removeItem('sanchaari_disruptions');
    localStorage.removeItem('sanchaari_buses');
    localStorage.removeItem('sanchaari_activity_logs');
    localStorage.removeItem('sanchaari_last_disruption');

    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setJourneys(INITIAL_JOURNEYS);
    setVehicles(INITIAL_VEHICLES);
    setAllocations(INITIAL_ALLOCATIONS);
    setDisruptions(INITIAL_DISRUPTIONS);
    setBusSchedules(INITIAL_BUS_SCHEDULES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setLastDisruptionResult(null);

    showAlert(
      'Application state reset to initial demo seeds!',
      'info'
    );
  };

  // --------------------------------------------------
  // SHARED CONTEXT
  // --------------------------------------------------

  const value = {
    // Student
    studentProfile,
    updateStudentProfile,

    // Journey requests
    journeys,
    createJourneyRequest,
    cancelJourney,
    updateJourneyStatus,
    triggerSosAlert,

    // Community vehicles
    vehicles,
    setVehicles,
    addVehicle,
    updateVehicle,
    toggleVehicleAvailability,

    // Matching allocations
    allocations,
    setAllocations,
    updateAllocation,

    // Disruptions
    disruptions,
    logDisruption,
    resolveDisruption,

    // Bus schedules
    busSchedules,
    setBusSchedules,

    // Alerts
    activeAlert,
    showAlert,

    // Reset
    resetAllData,

    // Member 3 admin utilities
    requests: journeys,
    setRequests: setJourneys,
    updateRequest,
    buses: busSchedules,
    activityLogs,
    addActivityLog,
    simulateBreakdown,
    repairVehicle,
    lastDisruptionResult,
    setLastDisruptionResult,
  };

  return (
    <MobilityContext.Provider value={value}>
      {children}
    </MobilityContext.Provider>
  );
}

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export function useMobility() {
  const context = useContext(MobilityContext);

  if (!context) {
    throw new Error(
      'useMobility must be used within a MobilityProvider'
    );
  }

  return context;
}
