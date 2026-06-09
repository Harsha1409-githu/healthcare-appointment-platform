import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("patientToken");

  const patientUser = JSON.parse(
    localStorage.getItem("patientUser") || "null"
  );

  if (!token || patientUser?.role !== "patient") {
    return <Navigate to="/login" replace />;
  }

  return children;
}