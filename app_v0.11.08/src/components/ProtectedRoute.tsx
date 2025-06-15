import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  // Sprawdź, czy użytkownik jest zalogowany
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = !!userRole;

  // Jeśli nie jest zalogowany, przekieruj na stronę logowania
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  // Jeśli określono role i użytkownik nie ma wymaganej roli, przekieruj do dashboardu
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  // W przeciwnym razie renderuj zawartość
  return <>{children}</>;
};

export default ProtectedRoute;
