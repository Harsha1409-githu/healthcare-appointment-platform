import { Navigate, useLocation } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("adminToken");

  let adminUser = null;

  try {
    adminUser = JSON.parse(
      localStorage.getItem("adminUser") || "null"
    );
  } catch (error) {
    console.error(
      "Invalid admin user data in localStorage:",
      error
    );

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  const isAdmin =
    adminUser?.role === "admin" ||
    adminUser?.role === "ADMIN" ||
    adminUser?.email === "admin@medicare.com" ||
    adminUser?.isAdmin === true;

  if (!token || !adminUser || !isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}