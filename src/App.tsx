/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense, lazy } from "react";
import type { FC } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import FlowbiteWrapper from "./components/flowbite-wrapper";

const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const ForgotPasswordPage = lazy(() => import("./pages/authentication/forgot-password"));
const ProfileLockPage = lazy(() => import("./pages/authentication/profile-lock"));
const ResetPasswordPage = lazy(() => import("./pages/authentication/reset-password"));
const SignInPage = lazy(() => import("./pages/authentication/sign-in"));
const SignUpPage = lazy(() => import("./pages/authentication/sign-up"));
const KanbanPage = lazy(() => import("./pages/kanban"));
const UserFeedPage = lazy(() => import("./pages/users/feed"));
const UserListPage = lazy(() => import("./pages/users/list"));
const SupplierListPage = lazy(() => import("./pages/users/listSuppliers"));
const UserProfilePage = lazy(() => import("./pages/users/profile"));
const UserSettingsPage = lazy(() => import("./pages/users/settings"));
const AdsPowerDashboardPage = lazy(() => import("./pages/admin/AdsPowerDashboardPage"));
const OrderListPage = lazy(() => import("./pages/admin/OrderListPage"));
// Komponent ochrony trasy - sprawdza czy użytkownik jest zalogowany i ma odpowiednią rolę
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element, allowedRoles = [] }) => {
  const userRole = localStorage.getItem("userRole");

  // Jeśli nie ma roli użytkownika w localStorage, przekieruj do logowania
  if (!userRole) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // Jeśli wymagane są konkretne role i użytkownik ich nie ma, przekieruj do panelu
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // W przeciwnym przypadku renderuj żądany komponent
  return <>{element}</>;
};

const App: FC = function () {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Trasa nadrzędna dla FlowbiteWrapper */}
          <Route element={<FlowbiteWrapper />}>
            {/* Chronione trasy - dostępne tylko dla zalogowanych użytkowników */}
            <Route path="/" element={<ProtectedRoute element={<AdminDashboardPage />} />} />
            <Route
              path="/admin/adspower-dashboard"
              element={<ProtectedRoute element={<AdsPowerDashboardPage />} allowedRoles={["admin"]} />}
            />
            <Route path="/admin/orders" element={<ProtectedRoute element={<OrderListPage />} />} />
            <Route
              path="/users/feed"
              element={<ProtectedRoute element={<UserFeedPage />} allowedRoles={["admin"]} />}
            />
            <Route
              path="/users/list"
              element={<ProtectedRoute element={<UserListPage />} allowedRoles={["admin"]} />}
            />
            <Route
              path="/users/listSuppliers"
              element={<ProtectedRoute element={<SupplierListPage />} allowedRoles={["admin"]} />}
            />
            <Route path="/users/profile" element={<ProtectedRoute element={<UserProfilePage />} />} />
            <Route path="/users/settings" element={<ProtectedRoute element={<UserSettingsPage />} />} />
            <Route path="/kanban" element={<ProtectedRoute element={<KanbanPage />} />} />
            <Route path="/authentication/sign-in" element={<SignInPage />} />
            <Route path="/authentication/sign-up" element={<SignUpPage />} />
            <Route path="/authentication/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/authentication/reset-password" element={<ResetPasswordPage />} />
            <Route path="/authentication/profile-lock" element={<ProfileLockPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
