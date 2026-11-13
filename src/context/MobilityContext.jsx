import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_JOURNEYS,
  INITIAL_VEHICLES,
  INITIAL_DISRUPTIONS,
  INITIAL_BUS_SCHEDULES,
} from './mockData';
import { findBestVehicleMatch } from '../services/matchingEngineInterface';
import { broadcastDisruption } from '../services/disruptionEngineInterface';

const MobilityContext = createContext(null);

export function MobilityProvider({ children }) {
  // 1. Student Profile
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('sanchaari_student');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  // 2. Journeys
  const [journeys, setJourneys] = useState(() => {
    const saved = localStorage.getItem('sanchaari_journeys');
    return saved ? JSON.parse(saved) : INITIAL_JOURNEYS;
  });

  // 3. Vehicles (Member 2 domain)
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('sanchaari_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  // 4. Transit Disruptions (Member 3 domain)
  const [disruptions, setDisruptions] = useState(() => {
    const saved = localStorage.getItem('sanchaari_disruptions');
    return saved ? JSON.parse(saved) : INITIAL_DISRUPTIONS;
  });

  // 5. Bus Schedules (Shared between Member 1 & 3)
  const [busSchedules, setBusSchedules] = useState(() => {
    const saved = localStorage.getItem('sanchaari_buses');
    return saved ? JSON.parse(saved) : INITIAL_BUS_SCHEDULES;
  });

  // 6. Active notification or flash alert
  const [activeAlert, setActiveAlert] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sanchaari_student', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('sanchaari_journeys', JSON.stringify(journeys));
  }, [journeys]);

  useEffect(() => {
    localStorage.setItem('sanchaari_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('sanchaari_disruptions', JSON.stringify(disruptions));
  }, [disruptions]);

  useEffect(() => {
    localStorage.setItem('sanchaari_buses', JSON.stringify(busSchedules));
  }, [busSchedules]);

  // Flash alert helper
  const showAlert = (message, type = 'success') => {
    setActiveAlert({ message, type });
    setTimeout(() => {
      setActiveAlert(null);
    }, 4500);
  };

  /**
   * Create a new Journey Request (Member 1)
   */
  const createJourneyRequest = async (requestData) => {
    const newJourneyId = `JRN-${Math.floor(100 + Math.random() * 900)}`;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newJourney = {
      id: newJourneyId,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      pickupLocation: requestData.pickupLocation,
      destinationLocation: requestData.destinationLocation,
      scheduledTime: requestData.scheduledTime || 'Immediate',
      createdAt: new Date().toISOString(),
      reason: requestData.reason || 'General Transit Assistance',
      urgency: requestData.urgency || 'Medium',
      status: 'requested',
      passengers: parseInt(requestData.passengers, 10) || 1,
      fareShare: `₹${(requestData.passengers || 1) * 25} (Estimated Subsidized)`,
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
          desc: 'Scanning nearby community autos, carpools and vans',
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
          desc: 'Safe arrival verified',
        },
      ],
    };

    // Prepend new journey
    setJourneys((prev) => [newJourney, ...prev]);
    showAlert(`Journey request ${newJourneyId} submitted successfully!`);

    // Automatic AI Matching Call (Interfacing with Member 2 service)
    try {
      const match = await findBestVehicleMatch(newJourney, vehicles);
      if (match) {
        // Update journey to matched
        setTimeout(() => {
          setJourneys((prev) =>
            prev.map((j) => {
              if (j.id === newJourneyId) {
                return {
                  ...j,
                  status: 'matched',
                  matchedVehicle: match,
                  trackingSteps: j.trackingSteps.map((step) => {
                    if (step.id === 2) {
                      return {
                        ...step,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        done: true,
                        desc: `Matched with ${match.driverName} (${match.vehicleType})`,
                      };
                    }
                    return step;
                  }),
                };
              }
              return j;
            })
          );
          showAlert(`🎉 Community Ride Matched for ${newJourneyId}! Driver: ${match.driverName}`, 'info');
        }, 1200);
      }
    } catch (err) {
      console.warn('AI matching stub call error:', err);
    }

    return newJourneyId;
  };

  /**
   * Cancel Journey (Member 1)
   */
  const cancelJourney = (journeyId, cancelReason = 'Cancelled by student') => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          return {
            ...j,
            status: 'cancelled',
            cancelReason,
            trackingSteps: [
              ...j.trackingSteps,
              {
                id: 99,
                label: 'Journey Cancelled',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                done: true,
                desc: cancelReason,
              },
            ],
          };
        }
        return j;
      })
    );
    showAlert(`Journey ${journeyId} was cancelled.`, 'warning');
  };

  /**
   * Update Journey Status & Simulator (For tracking demos)
   */
  const updateJourneyStatus = (journeyId, nextStatus) => {
    setJourneys((prev) =>
      prev.map((j) => {
        if (j.id === journeyId) {
          let updatedSteps = [...j.trackingSteps];
          const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (nextStatus === 'in-progress') {
            updatedSteps = updatedSteps.map((s) => {
              if (s.id <= 4) return { ...s, done: true, time: s.time === '--' ? timeNow : s.time };
              return s;
            });
          } else if (nextStatus === 'completed') {
            updatedSteps = updatedSteps.map((s) => ({
              ...s,
              done: true,
              time: s.time === '--' ? timeNow : s.time,
            }));
          }

          return {
            ...j,
            status: nextStatus,
            trackingSteps: updatedSteps,
          };
        }
        return j;
      })
    );
    showAlert(`Journey ${journeyId} updated to: ${nextStatus}`);
  };

  /**
   * Trigger SOS / Emergency Alert during active journey
   */
  const triggerSosAlert = (journeyId) => {
    const journey = journeys.find((j) => j.id === journeyId);
    showAlert(
      `🚨 EMERGENCY SOS ACTIVATED! Alert dispatched to ${studentProfile.emergencyContact.name} (${studentProfile.emergencyContact.phone}) and Campus Security!`,
      'danger'
    );
  };

  /**
   * Update Student Profile (Member 1)
   */
  const updateStudentProfile = (newProfileData) => {
    setStudentProfile((prev) => ({
      ...prev,
      ...newProfileData,
    }));
    showAlert('Profile updated successfully!');
  };

  /**
   * Disruption Logging (Interface for Member 3)
   */
  const logDisruption = async (disruptionData) => {
    const result = await broadcastDisruption(disruptionData);
    if (result?.disruption) {
      setDisruptions((prev) => [result.disruption, ...prev]);
      showAlert(`Transit Disruption logged for ${result.disruption.routeNumber}`, 'warning');
    }
  };

  /**
   * Resolve Disruption (Member 3)
   */
  const resolveDisruption = (disruptionId) => {
    setDisruptions((prev) =>
      prev.map((d) => (d.id === disruptionId ? { ...d, status: 'Resolved' } : d))
    );
    showAlert(`Disruption ${disruptionId} marked as resolved.`, 'success');
  };

  /**
   * Reset All Mock Data (Helper for presentation demos)
   */
  const resetAllData = () => {
    localStorage.removeItem('sanchaari_student');
    localStorage.removeItem('sanchaari_journeys');
    localStorage.removeItem('sanchaari_vehicles');
    localStorage.removeItem('sanchaari_disruptions');
    localStorage.removeItem('sanchaari_buses');

    setStudentProfile(DEFAULT_STUDENT_PROFILE);
    setJourneys(INITIAL_JOURNEYS);
    setVehicles(INITIAL_VEHICLES);
    setDisruptions(INITIAL_DISRUPTIONS);
    setBusSchedules(INITIAL_BUS_SCHEDULES);

    showAlert('Application state reset to initial demo seeds!', 'info');
  };

  const value = {
    studentProfile,
    updateStudentProfile,
    journeys,
    createJourneyRequest,
    cancelJourney,
    updateJourneyStatus,
    triggerSosAlert,
    vehicles,
    setVehicles,
    disruptions,
    logDisruption,
    resolveDisruption,
    busSchedules,
    setBusSchedules,
    activeAlert,
    showAlert,
    resetAllData,
  };

  return <MobilityContext.Provider value={value}>{children}</MobilityContext.Provider>;
}

export function useMobility() {
  const context = useContext(MobilityContext);
  if (!context) {
    throw new Error('useMobility must be used within a MobilityProvider');
  }
  return context;
}
