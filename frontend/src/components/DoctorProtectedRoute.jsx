import { Navigate, useLocation } from "react-router-dom";

export default function DoctorProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("doctorToken");

  let doctorUser = null;

  try {
    doctorUser = JSON.parse(localStorage.getItem("doctorUser") || "null");
  } catch (error) {
    console.error("Invalid doctor user in localStorage:", error);
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
  }

  const isDoctor =
    doctorUser?.role === "doctor" ||
    doctorUser?.role === "DOCTOR" ||
    doctorUser?.doctorName ||
    doctorUser?.specialization;

  if (!token || !doctorUser || !isDoctor) {
    return (
      <Navigate
        to="/doctor/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}