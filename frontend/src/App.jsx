import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import PatientLayout from "./components/layout/PatientLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HospitalLayout from "./components/HospitalLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import DoctorProtectedRoute from "./components/DoctorProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

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

import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDoctors from "./pages/HospitalDoctors";
import HospitalAvailability from "./pages/HospitalAvailability";
import HospitalAppointments from "./pages/HospitalAppointments";

import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitals from "./pages/AdminHospitals";
import AdminDoctors from "./pages/AdminDoctors";

function App() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
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
      </Route>

      {/* PATIENT PORTAL */}
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
      </Route>

      {/* OLD PATIENT ROUTES - KEEP FOR NOW */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
        path="/book/:doctorId/:slotId"
        element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      {/* DOCTOR PORTAL */}
      <Route
        path="/doctor"
        element={
          <DoctorProtectedRoute>
            <DoctorLayout />
          </DoctorProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DoctorDashboard />} />
      </Route>

      {/* HOSPITAL PORTAL */}
      <Route path="/hospital" element={<HospitalLayout />}>
        <Route path="dashboard" element={<HospitalDashboard />} />
        <Route path="doctors" element={<HospitalDoctors />} />
        <Route path="availability" element={<HospitalAvailability />} />
        <Route path="appointments" element={<HospitalAppointments />} />
      </Route>

      {/* ADMIN PORTAL */}
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
      </Route>
    </Routes>
  );
}

export default App;