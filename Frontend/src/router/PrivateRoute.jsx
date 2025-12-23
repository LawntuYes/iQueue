import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user } = useAuth(); // מחזיר null אם לא מחובר

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

