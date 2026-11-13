
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
} from './mockData';

import { matchJourneyRequest } from '../services/matchingEngineInterface';

import { broadcastDisruption } from '../services/disruptionEngineInterface';

const MobilityContext = createContext(null);

// Safely read persisted application data.
const loadData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Could not load ${key}:`, error);
    return fallback;
  }
};

export function MobilityProvider({ children }) {
  // 1. Student Profile
  const [studentProfile, setStudentProfile] = useState(() =>
    loadData('sanchaari_student', DEFAULT_STUDENT_PROFILE)
  );

  // 2. Student Journey Requests
  const [journeys, setJourneys] = useState(() =>
    loadData('sanchaari_journeys', INITIAL_JOURNEYS)
  );

  // 3. Community Vehicles - Member 2
  const [vehicles, setVehicles] = useState(() =>
    loadData('sanchaari_vehicles', INITIAL_VEHICLES)
  );

  // 4. Vehicle Allocations - Member 2
  const [allocations, setAllocations] = useState(() =>
    loadData('sanchaari_allocations', [])
  );

  // 5. Transit Disruptions - Member 3
  const [disruptions, setDisruptions] = useState(() =>
    loadData('sanchaari_disruptions', INITIAL_DISRUPTIONS)
  );

  // 6. Bus Schedules - Shared
  const [busSchedules, setBusSchedules] = useState(() =>
    loadData('sanchaari_buses', INITIAL_BUS_SCHEDULES)
  );

  // 7. Notifications
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
  // CREATE JOURNEY REQUEST - MEMBER 1
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

      pickupLocation: requestData.pickupLocation,
      destinationLocation: requestData.destinationLocation,

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

    // Save the student request first.
    setJourneys((previous) => [
      newJourney,
      ...previous,
    ]);

    showAlert(
      `Journey request ${newJourneyId} submitted successfully!`
    );

    // ------------------------------------------------
    // MEMBER 2 MATCHING ENGINE
    // ------------------------------------------------

    try {
      const matchingResult = matchJourneyRequest(
        newJourney,
        vehicles,
        allocations
      );

      if (matchingResult.match) {
        const match = matchingResult.match;

        // Update vehicle seat availability.
        setVehicles(matchingResult.updatedVehicles);

        // Save allocation records.
        setAllocations((previous) => [
          ...previous,
          ...matchingResult.allocations,
        ]);

        // Update the student's journey.
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

              trackingSteps: journey.trackingSteps.map(
                (step) => {
                  if (step.id === 2) {
                    return {
                      ...step,

                      time: new Date().toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      ),

                      done: true,

                      desc: `Matched with ${match.driverName} (${match.vehicleType})`,
                    };
                  }

                  return step;
                }
              ),
            };
          })
        );

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
              allocation.passengerCount;

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
        if (item.id !== journeyId) return item;

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

        const timeNow = new Date().toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        );

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
  // DISRUPTION LOGGING - MEMBER 3
  // --------------------------------------------------

  const logDisruption = async (disruptionData) => {
    const result = await broadcastDisruption(
      disruptionData
    );

    if (result?.disruption) {
      setDisruptions((previous) => [
        result.disruption,
        ...previous,
      ]);

      showAlert(
        `Transit Disruption logged for ${result.disruption.routeNumber}`,
        'warning'
      );
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

    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setJourneys(INITIAL_JOURNEYS);
    setVehicles(INITIAL_VEHICLES);
    setAllocations([]);
    setDisruptions(INITIAL_DISRUPTIONS);
    setBusSchedules(INITIAL_BUS_SCHEDULES);

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
  };

  return (
    <MobilityContext.Provider value={value}>
      {children}
    </MobilityContext.Provider>
  );
}

export function useMobility() {
  const context = useContext(MobilityContext);

  if (!context) {
    throw new Error(
      'useMobility must be used within a MobilityProvider'
    );
  }

  return context;
}
