import type { FC, PropsWithChildren } from "react";
import NavbarSidebarLayout from "./navbar-sidebar";

interface DashboardLayoutProps {
  title: string;
}

const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({ children, title }) => {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        {children}
      </div>
    </NavbarSidebarLayout>
  );
};

export default DashboardLayout;
