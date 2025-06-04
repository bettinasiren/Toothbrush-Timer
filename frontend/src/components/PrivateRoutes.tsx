import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserContext";

function PrivateRoutes() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
