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

import SuccessPage from "./pages/SuccessPage";

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

import Account from "./pages/Account";
import AuthLanding from "./pages/AuthLanding";
import OtpLogin from "./pages/OtpLogin";
import RootRedirect from "./pages/RootRedirect";
import PatientProfileSelect from "./pages/PatientProfileSelect";

import DoctorVideoConsult from "./pages/DoctorVideoConsult";
import DoctorHub from "./pages/DoctorHub";
import {
  AppointmentCalendarPage,
  AppointmentCheckInPage,
  BookAppointmentPage,
  DoctorAppointmentDetailsPage,
  DoctorAppointmentsPage,
  HospitalAppointmentsPage,
  PatientAppointmentDetailsPage,
  PatientAppointmentsPage,
} from "@/modules/appointments";


import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDoctors from "./pages/HospitalDoctors";
import HospitalAvailability from "./pages/HospitalAvailability";

import HospitalProfile from "./pages/HospitalProfile";
import HospitalAnalytics from "./pages/HospitalAnalytics";
import HospitalRegister from "./pages/HospitalRegister";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";

import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorMyProfile from "./pages/DoctorMyProfile";
import DoctorPatientProfile from "./pages/DoctorPatientProfile";

import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorAnalytics from "./pages/DoctorAnalytics";
import DoctorReviews from "./pages/DoctorReviews";
import DoctorFollowUps from "./pages/DoctorFollowUps";
import DoctorLeaveManagement from "./pages/DoctorLeaveManagement";
import DoctorNotifications from "./pages/DoctorNotifications";
import DoctorEarnings from "./pages/DoctorEarnings";
import DoctorSettings from "./pages/DoctorSettings";
import DoctorConsultationWorkspace from "./pages/DoctorConsultationWorkspace";

import AIDoctorMatch from "./pages/AIDoctorMatch";
import AIHealthInsights from "./pages/AIHealthInsights";
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
import EmergencyProfile from "./pages/EmergencyProfile";
import ManageProfiles from "./pages/ManageProfiles";
import EditFamilyProfile from "./pages/EditFamilyProfile";



function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<RootRedirect />} />
<Route path="/home" element={<Home />} />
<Route path="/welcome" element={<AuthLanding />} />
          
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/video-consult" element={<VideoConsult />} />
          
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/otp-login" element={<OtpLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/register" element={<HospitalRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
 <Route path="/hospital/:id" element={<HospitalDetails />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/ai-doctor-match" element={<AIDoctorMatch />} />
          <Route path="/ai-health-assistant" element={<AIHealthAssistant />} />
         
         <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>

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
                <PatientAppointmentsPage />
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
               <BookAppointmentPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
  path="/patient/select-profile"
  element={
    <ProtectedRoute>
      <PatientProfileSelect />
    </ProtectedRoute>
  }
/>

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
  <Route path="success" element={<SuccessPage />} />
  <Route path="appointments" element={<PatientAppointmentsPage />} />
  <Route
  path="appointments/:id"
  element={<PatientAppointmentDetailsPage />}
/>
<Route
  path="appointments/:id/checkin"
  element={<AppointmentCheckInPage />}
/>
  <Route path="notifications" element={<Notifications />} />
  <Route path="prescriptions" element={<MyPrescriptions />} />
  <Route path="symptom-history" element={<SymptomHistory />} />
  <Route path="profile" element={<PatientProfile />} />
  <Route path="manage-profiles" element={<ManageProfiles />} />
  <Route path="edit-family-profile/:id" element={<EditFamilyProfile />} />
  <Route path="medical-records" element={<MedicalRecords />} />
  <Route
  path="emergency-profile"
  element={<EmergencyProfile />}
/>
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
          <Route path="appointments" element={<DoctorAppointmentsPage />} />
          <Route
  path="/doctor/appointment/:appointmentId/details"
  element={<DoctorAppointmentDetailsPage />}
/>
          <Route path="availability" element={<DoctorAvailability />} />
         <Route path="hub" element={<DoctorHub />} />
          <Route path="follow-ups" element={<DoctorFollowUps />} /> 
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="analytics" element={<DoctorAnalytics />} />
         <Route path="settings" element={<DoctorSettings />} />
          <Route path="reviews" element={<DoctorReviews />} />
      <Route path="leave" element={<DoctorLeaveManagement />} />
      <Route
  path="consultation/:appointmentId"
  element={<DoctorConsultationWorkspace />}
/>
          <Route
            path="appointment/:appointmentId/patient-profile"
            element={<DoctorPatientProfile />}
          />
          <Route
  path="notifications"
  element={<DoctorNotifications />}
/>
          <Route path="earnings" element={<DoctorEarnings />} />
          <Route
  path="/doctor/video-consult/:appointmentId"
  element={<DoctorVideoConsult />}
/>
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="calendar" element={<AppointmentCalendarPage />} />
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
          <Route path="appointments" element={<HospitalAppointmentsPage />} />
          <Route path="profile" element={<HospitalProfile />} />
          <Route path="calendar" element={<AppointmentCalendarPage />} />
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
    </>
  );
}
export default App;