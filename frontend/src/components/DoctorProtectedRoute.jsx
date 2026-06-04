import { Navigate } from "react-router-dom";

export default function DoctorProtectedRoute({ children }) {
  const token = localStorage.getItem("doctorToken");
  const doctorUser = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
  );

  if (!token || doctorUser?.role !== "doctor") {
    return <Navigate to="/doctor/login" replace />;
  }

  return children;
}