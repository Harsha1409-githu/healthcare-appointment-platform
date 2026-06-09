import { Navigate } from "react-router-dom";

export default function HospitalProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem("hospitalToken");

  const hospitalUser = JSON.parse(
    localStorage.getItem("hospitalUser") || "null"
  );

  if (
    !token ||
    hospitalUser?.role !== "hospital"
  ) {
    return (
      <Navigate
        to="/hospital/login"
        replace
      />
    );
  }

  return children;
}