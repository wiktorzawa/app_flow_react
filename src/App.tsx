import React, { Suspense, lazy } from "react";
import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import FlowbiteWrapper from "./components/flowbite-wrapper";

const DashboardPage = lazy(() => import("./pages"));
const ForgotPasswordPage = lazy(() => import("./pages/authentication/forgot-password"));
const ProfileLockPage = lazy(() => import("./pages/authentication/profile-lock"));
const ResetPasswordPage = lazy(() => import("./pages/authentication/reset-password"));
const SignInPage = lazy(() => import("./pages/authentication/sign-in"));
const SignUpPage = lazy(() => import("./pages/authentication/sign-up"));
const EcommerceBillingPage = lazy(() => import("./pages/e-commerce/billing"));
const EcommerceInvoicePage = lazy(() => import("./pages/e-commerce/invoice"));
const EcommerceProductsPage = lazy(() => import("./pages/e-commerce/products"));
const KanbanPage = lazy(() => import("./pages/kanban"));
const MailingComposePage = lazy(() => import("./pages/mailing/compose"));
const MailingInboxPage = lazy(() => import("./pages/mailing/inbox"));
const MailingReadPage = lazy(() => import("./pages/mailing/read"));
const MailingReplyPage = lazy(() => import("./pages/mailing/reply"));
const NotFoundPage = lazy(() => import("./pages/pages/404"));
const ServerErrorPage = lazy(() => import("./pages/pages/500"));
const MaintenancePage = lazy(() => import("./pages/pages/maintenance"));
const PricingPage = lazy(() => import("./pages/pages/pricing"));
const UserFeedPage = lazy(() => import("./pages/users/feed"));
const UserListPage = lazy(() => import("./pages/users/list"));
const SupplierListPage = lazy(() => import("./pages/users/listSuppliers"));
const UserProfilePage = lazy(() => import("./pages/users/profile"));
const UserSettingsPage = lazy(() => import("./pages/users/settings"));
const AdsPowerDashboardPage = lazy(() => import("./pages/admin/AdsPowerDashboardPage"));
const DatabaseViewer = lazy(() => import("./pages/DatabaseViewer"));

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
          <Route element={<FlowbiteWrapper />}>
            {/* Chronione trasy - dostępne tylko dla zalogowanych użytkowników */}
            <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
            <Route
              path="/admin/AdsPowerDashboard"
              element={<ProtectedRoute element={<AdsPowerDashboardPage />} allowedRoles={["admin"]} />}
            />
            <Route
              path="/DatabaseViewer"
              element={<ProtectedRoute element={<DatabaseViewer />} allowedRoles={["admin"]} />}
            />
            <Route path="/mailing/compose" element={<ProtectedRoute element={<MailingComposePage />} />} />
            <Route path="/mailing/inbox" element={<ProtectedRoute element={<MailingInboxPage />} />} />
            <Route path="/mailing/read" element={<ProtectedRoute element={<MailingReadPage />} />} />
            <Route path="/mailing/reply" element={<ProtectedRoute element={<MailingReplyPage />} />} />
            <Route path="/kanban" element={<ProtectedRoute element={<KanbanPage />} />} />
            <Route path="/pages/pricing" element={<ProtectedRoute element={<PricingPage />} />} />
            <Route path="/pages/maintenance" element={<ProtectedRoute element={<MaintenancePage />} />} />

            {/* Trasy z ograniczeniami ról */}
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

            <Route path="/e-commerce/billing" element={<ProtectedRoute element={<EcommerceBillingPage />} />} />
            <Route path="/e-commerce/invoice" element={<ProtectedRoute element={<EcommerceInvoicePage />} />} />
            <Route path="/e-commerce/products" element={<ProtectedRoute element={<EcommerceProductsPage />} />} />

            {/* Publiczne trasy - dostępne dla wszystkich */}
            <Route path="/authentication/sign-in" element={<SignInPage />} />
            <Route path="/authentication/sign-up" element={<SignUpPage />} />
            <Route path="/authentication/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/authentication/reset-password" element={<ResetPasswordPage />} />
            <Route path="/authentication/profile-lock" element={<ProfileLockPage />} />
            <Route path="/pages/404" element={<NotFoundPage />} />
            <Route path="/pages/500" element={<ServerErrorPage />} />

            {/* Przekierowanie z nieznanych ścieżek na stronę główną lub logowanie */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
