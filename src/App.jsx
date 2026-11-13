import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobilityProvider } from './context/MobilityContext';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';

// Student Pages (Member 1)
import StudentDashboard from './pages/student/StudentDashboard';
import JourneyRequestForm from './pages/student/JourneyRequestForm';
import MyJourneys from './pages/student/MyJourneys';
import JourneyDetails from './pages/student/JourneyDetails';
import OnwardBusInfo from './pages/student/OnwardBusInfo';
import StudentProfile from './pages/student/StudentProfile';

// Community Vehicle Portal (Member 2)
import CommunityVehiclePortal from './pages/community/CommunityVehiclePortal';

// Admin Operations & Disruption Management Pages (Member 3)
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestsPage from './pages/admin/RequestsPage';
import VehiclesPage from './pages/admin/VehiclesPage';
import DisruptionsPage from './pages/admin/DisruptionsPage';
import BusesPage from './pages/admin/BusesPage';
import DemandIntelligencePage from './pages/admin/DemandIntelligencePage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <MobilityProvider>
      <BrowserRouter>
        <Routes>
          {/* Member 1: Student Mobility Coordinator Portal & Member 2 Vehicle Portal */}
          <Route path="/" element={<RootLayout />}>
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

            {/* Backward-compatibility redirect for legacy stub */}
            <Route path="admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Member 3: Dedicated Admin Dashboard & Disruption Management Hub */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="disruptions" element={<DisruptionsPage />} />
            <Route path="buses" element={<BusesPage />} />
            <Route path="demand" element={<DemandIntelligencePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MobilityProvider>
  );
}
