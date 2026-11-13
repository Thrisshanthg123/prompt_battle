import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobilityProvider } from './context/MobilityContext';
import RootLayout from './layouts/RootLayout';

// Student Pages (Member 1)
import StudentDashboard from './pages/student/StudentDashboard';
import JourneyRequestForm from './pages/student/JourneyRequestForm';
import MyJourneys from './pages/student/MyJourneys';
import JourneyDetails from './pages/student/JourneyDetails';
import OnwardBusInfo from './pages/student/OnwardBusInfo';
import StudentProfile from './pages/student/StudentProfile';

// Teammate Stubs (Members 2 & 3)
import CommunityVehiclePortal from './pages/community/CommunityVehiclePortal';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <MobilityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Member 1: Student Mobility Coordinator Pages */}
            <Route index element={<StudentDashboard />} />
            <Route path="student" element={<Navigate to="/" replace />} />
            <Route path="request-journey" element={<JourneyRequestForm />} />
            <Route path="my-journeys" element={<MyJourneys />} />
            <Route path="tracking" element={<JourneyDetails />} />
            <Route path="tracking/:id" element={<JourneyDetails />} />
            <Route path="onward-bus" element={<OnwardBusInfo />} />
            <Route path="profile" element={<StudentProfile />} />

            {/* Member 2: Community Vehicle Portal & AI Matching Engine */}
            <Route path="community-portal" element={<CommunityVehiclePortal />} />

            {/* Member 3: Admin Dashboard & Disruption Management */}
            <Route path="admin-dashboard" element={<AdminDashboard />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MobilityProvider>
  );
}
