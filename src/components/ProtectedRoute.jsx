import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, isRefreshing } = useContext(AuthContext);

  // Während refresh → Ladeanzeige
  if (isRefreshing) {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
  }

  // Nicht eingeloggt → Weiterleitung zu Login
  if (!user) return <Navigate to="/login" replace />;

  // Falls Rollen angegeben sind → prüfen
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Alles OK → render Outlet (Kinder-Routes)
  return <Outlet />;
};

export default ProtectedRoute;
