import React from "react";
import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import EcommerceBillingPage from "./pages/e-commerce/billing";
import EcommerceInvoicePage from "./pages/e-commerce/invoice";
import EcommerceProductsPage from "./pages/e-commerce/products";
import KanbanPage from "./pages/kanban";
import MailingComposePage from "./pages/mailing/compose";
import MailingInboxPage from "./pages/mailing/inbox";
import MailingReadPage from "./pages/mailing/read";
import MailingReplyPage from "./pages/mailing/reply";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import MaintenancePage from "./pages/pages/maintenance";
import PricingPage from "./pages/pages/pricing";
import UserFeedPage from "./pages/users/feed";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";
import FlowbiteWrapper from "./components/flowbite-wrapper";

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
      <Routes>
        <Route element={<FlowbiteWrapper />}>
          {/* Chronione trasy - dostępne tylko dla zalogowanych użytkowników */}
          <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/mailing/compose" element={<ProtectedRoute element={<MailingComposePage />} />} />
          <Route path="/mailing/inbox" element={<ProtectedRoute element={<MailingInboxPage />} />} />
          <Route path="/mailing/read" element={<ProtectedRoute element={<MailingReadPage />} />} />
          <Route path="/mailing/reply" element={<ProtectedRoute element={<MailingReplyPage />} />} />
          <Route path="/kanban" element={<ProtectedRoute element={<KanbanPage />} />} />
          <Route path="/pages/pricing" element={<ProtectedRoute element={<PricingPage />} />} />
          <Route path="/pages/maintenance" element={<ProtectedRoute element={<MaintenancePage />} />} />
          
          {/* Trasy z ograniczeniami ról */}
          <Route path="/users/feed" element={<ProtectedRoute element={<UserFeedPage />} allowedRoles={["admin"]} />} />
          <Route path="/users/list" element={<ProtectedRoute element={<UserListPage />} allowedRoles={["admin"]} />} />
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
    </BrowserRouter>
  );
};

export default App;
