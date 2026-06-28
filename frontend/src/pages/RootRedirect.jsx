import { Navigate } from "react-router-dom";

export default function RootRedirect() {
  const patientToken = localStorage.getItem("patientToken");

  if (!patientToken) {
    return <Navigate to="/welcome" replace />;
  }

  return <Navigate to="/home" replace />;
}