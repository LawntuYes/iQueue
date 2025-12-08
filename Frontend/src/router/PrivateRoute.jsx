import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user } = useAuth(); // מחזיר null אם לא מחובר

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

