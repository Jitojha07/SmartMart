import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = sessionStorage.getItem("smartmartUser");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    sessionStorage.removeItem("smartmartUser");
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === "SELLER") {
      return <Navigate to="/seller" replace />;
    }

    if (user?.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;