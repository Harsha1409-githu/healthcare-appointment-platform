import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import SuccessPage from "./pages/SuccessPage";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDoctors from "./pages/HospitalDoctors";
import HospitalAvailability from "./pages/HospitalAvailability";
import HospitalAppointments from "./pages/HospitalAppointments";
import MyPrescriptions from "./pages/MyPrescriptions";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route
          path="/doctor/:id"
          element={<DoctorProfile />}
        />

        <Route path="/success" element={<SuccessPage />} />

        <Route path="/login" element={<Login />} />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/dashboard"
  element={
    <ProtectedRoute>
      <HospitalDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/doctors"
  element={
    <ProtectedRoute>
      <HospitalDoctors />
    </ProtectedRoute>
  }
/>
        <Route
  path="/register"
  element={<Register />}
/>

<Route
  path="/hospital/availability"
  element={
    <ProtectedRoute>
      <HospitalAvailability />
    </ProtectedRoute>
  }
/>

<Route
  path="/hospital/appointments"
  element={
    <ProtectedRoute>
      <HospitalAppointments />
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
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
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
      </Routes>
    </>
  );
}

export default App;