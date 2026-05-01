import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";

function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;