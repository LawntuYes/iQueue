import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user, loading } = useAuth(); 

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Or just null/spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

