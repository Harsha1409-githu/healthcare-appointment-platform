import { Navigate, useLocation } from "react-router-dom";

export default function HospitalProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("hospitalToken");

  let hospitalUser = null;

  try {
    hospitalUser = JSON.parse(
      localStorage.getItem("hospitalUser") || "null"
    );
  } catch (error) {
    console.error("Invalid hospital user in localStorage:", error);
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
  }

  const isHospital =
    hospitalUser?.role === "hospital" ||
    hospitalUser?.role === "HOSPITAL" ||
    hospitalUser?.hospitalName;

  if (!token || !hospitalUser || !isHospital) {
    return (
      <Navigate
        to="/hospital/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}