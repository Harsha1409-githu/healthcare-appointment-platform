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
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import PatientProfile from "./pages/PatientProfile";
import ChangePassword from "./pages/ChangePassword";
import Notifications from "./pages/Notifications";
import VideoCall from "./pages/VideoCall";
import VideoConsult from "./pages/VideoConsult";
import AppointmentCalendar from "./pages/AppointmentCalendar";

import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDoctors from "./pages/HospitalDoctors";
import HospitalAvailability from "./pages/HospitalAvailability";
import HospitalAppointments from "./pages/HospitalAppointments";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalAnalytics from "./pages/HospitalAnalytics";
import HospitalRegister from "./pages/HospitalRegister";
import Hospitals from "./pages/Hospitals";

import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorMyProfile from "./pages/DoctorMyProfile";
import DoctorPatientProfile from "./pages/DoctorPatientProfile";
import AIDoctorMatch from "./pages/AIDoctorMatch";
import AIHealthInsights from "./pages/AIHealthInsights";
import FloatingAI from "./components/FloatingAI";
import AIHealthAssistant from "./pages/AIHealthAssistant";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitals from "./pages/AdminHospitals";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAnalytics from "./pages/AdminAnalytics";

import SymptomChecker from "./pages/SymptomChecker";
import SymptomHistory from "./pages/SymptomHistory";
import MedicalRecords from "./pages/MedicalRecords";
import MedicineReminders from "./pages/MedicineReminders";
import HealthTimeline from "./pages/HealthTimeline";
import LabTests from "./pages/LabTests";
import ChatRoom from "./pages/ChatRoom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/video-consult" element={<VideoConsult />} />

          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/success" element={<SuccessPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/register" element={<HospitalRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/ai-doctor-match" element={<AIDoctorMatch />} />
          <Route path="/ai-health-assistant" element={<AIHealthAssistant />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/video-call/:appointmentId" element={<VideoCall />} />

          <Route
            path="/chat/:appointmentId"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />

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
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="prescriptions" element={<MyPrescriptions />} />
          <Route path="symptom-history" element={<SymptomHistory />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="medicine-reminders" element={<MedicineReminders />} />
          <Route path="health-timeline" element={<HealthTimeline />} />
          <Route path="lab-tests" element={<LabTests />} />
          <Route path="ai-health-insights" element={<AIHealthInsights />} />
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
          <Route
            path="appointment/:appointmentId/patient-profile"
            element={<DoctorPatientProfile />}
          />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
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

      <FloatingAI />
    </>
  );
}
export default App;