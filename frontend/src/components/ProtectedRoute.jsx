import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("patientToken");

  let patientUser = null;

  try {
    patientUser = JSON.parse(localStorage.getItem("patientUser") || "null");
  } catch (error) {
    console.error("Invalid patient user in localStorage:", error);
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
  }

  const isPatient =
    patientUser?.role === "patient" ||
    patientUser?.role === "PATIENT" ||
    patientUser?.fullName ||
    patientUser?.email;

  if (!token || !patientUser || !isPatient) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}