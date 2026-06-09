import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import PatientLayout from "./components/layout/PatientLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HospitalLayout from "./components/HospitalLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import DoctorProtectedRoute from "./components/DoctorProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import HospitalProtectedRoute from "./components/HospitalProtectedRoute";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import SuccessPage from "./pages/SuccessPage";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyPrescriptions from "./pages/MyPrescriptions";
import PatientProfile from "./pages/PatientProfile";
import ChangePassword from "./pages/ChangePassword";
import Notifications from "./pages/Notifications";
import VideoCall from "./pages/VideoCall";
import AppointmentCalendar from "./pages/AppointmentCalendar";

import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDoctors from "./pages/HospitalDoctors";
import HospitalAvailability from "./pages/HospitalAvailability";
import HospitalAppointments from "./pages/HospitalAppointments";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalAnalytics from "./pages/HospitalAnalytics";
import HospitalRegister from "./pages/HospitalRegister";

import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorMyProfile from "./pages/DoctorMyProfile";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitals from "./pages/AdminHospitals";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAnalytics from "./pages/AdminAnalytics";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />

        <Route path="/notifications" element={<Notifications />} />

        <Route path="/video-call/:appointmentId" element={<VideoCall />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <MyPrescriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:doctorId/:slotId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="prescriptions" element={<MyPrescriptions />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route
        path="/doctor"
        element={
          <DoctorProtectedRoute>
            <DoctorLayout />
          </DoctorProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="profile" element={<DoctorMyProfile />} />
        <Route path="appointments" element={<Appointments />} />
         <Route path="prescriptions" element={<MyPrescriptions />} />
         <Route path="calendar" element={<AppointmentCalendar />} />
        <Route path="change-password" element={<ChangePassword />} />
        

      </Route>

      <Route
        path="/hospital"
        element={
          <HospitalProtectedRoute>
            <HospitalLayout />
          </HospitalProtectedRoute>
        }
      >
        <Route path="dashboard" element={<HospitalDashboard />} />
        <Route path="doctors" element={<HospitalDoctors />} />
        <Route path="availability" element={<HospitalAvailability />} />
        <Route path="appointments" element={<HospitalAppointments />} />
        <Route path="profile" element={<HospitalProfile />} />
        <Route path="calendar" element={<AppointmentCalendar />} />
        <Route path="analytics" element={<HospitalAnalytics />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="hospitals" element={<AdminHospitals />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}

export default App;