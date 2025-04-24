import { FC, ReactNode } from "react";

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

const RoleBasedAccess: FC<RoleBasedAccessProps> = ({ 
  allowedRoles, 
  children, 
  fallback = null 
}) => {
  // Pobierz rolę użytkownika z localStorage
  const userRole = localStorage.getItem('userRole');
  
  // Renderuj dzieci tylko jeśli rola użytkownika jest dozwolona
  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  // W przeciwnym razie renderuj fallback (domyślnie nic)
  return <>{fallback}</>;
};

export default RoleBasedAccess; 