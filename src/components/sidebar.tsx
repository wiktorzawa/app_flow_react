/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  Sidebar as FlowbiteSidebar,
  SidebarItems,
  SidebarItemGroup,
  SidebarItem,
  SidebarCollapse,
} from "flowbite-react";
import {
  HiChartPie,
  HiChartSquareBar,
  HiClipboard,
  HiCollection,
  HiInboxIn,
  HiInformationCircle,
  HiLockClosed,
  HiShoppingBag,
  HiUsers,
  HiViewGrid,
} from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";

// Stałe i pomocnicze funkcje

const isAdmin = (): boolean => localStorage.getItem("userRole") === "admin";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const Sidebar: FC = function () {
  const { isCollapsed, isOpenOnMobile } = useSidebarContext();
  const [currentPage, setCurrentPage] = useState("");
  const [isEcommerceOpen, setEcommerceOpen] = useState(true);
  const [isUsersOpen, setUsersOpen] = useState(true);

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
    setEcommerceOpen(newPage.includes("/e-commerce/") || newPage.includes("/admin/orders"));
    setUsersOpen(newPage.includes("/users/"));
  }, []);

  return (
    <div className={`lg:!block ${!isOpenOnMobile && "hidden"}`}>
      <FlowbiteSidebar aria-label="Sidebar with multi-level dropdown" collapsed={isCollapsed}>
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="/" icon={HiChartPie} active={currentPage === "/"}>
              Dashboard
            </SidebarItem>
            <SidebarCollapse icon={HiShoppingBag} label="E-commerce" open={isEcommerceOpen}>
              <SidebarItem href="/admin/orders" active={currentPage === "/admin/orders"}>
                Orders
              </SidebarItem>
              <SidebarItem href="/e-commerce/products" active={currentPage === "/e-commerce/products"}>
                Products
              </SidebarItem>
            </SidebarCollapse>
            <SidebarItem
              href="/admin/adspower-dashboard"
              icon={HiViewGrid}
              active={currentPage === "/admin/adspower-dashboard"}
            >
              ADS Power
            </SidebarItem>
            <SidebarItem href="/kanban" icon={HiCollection} active={currentPage === "/kanban"}>
              Kanban
            </SidebarItem>
            <SidebarItem href="/mailing/inbox" icon={HiInboxIn} active={currentPage === "/mailing/inbox"}>
              Inbox
            </SidebarItem>
            {isAdmin() && (
              <SidebarCollapse icon={HiUsers} label="Users" open={isUsersOpen}>
                <SidebarItem href="/users/list" active={currentPage === "/users/list"}>
                  All users
                </SidebarItem>
                <SidebarItem href="/users/listSuppliers" active={currentPage === "/users/listSuppliers"}>
                  Suppliers
                </SidebarItem>
                <SidebarItem href="/users/profile" active={currentPage === "/users/profile"}>
                  Profile
                </SidebarItem>
                <SidebarItem href="/users/feed" active={currentPage === "/users/feed"}>
                  Feed
                </SidebarItem>
                <SidebarItem href="/users/settings" active={currentPage === "/users/settings"}>
                  Settings
                </SidebarItem>
              </SidebarCollapse>
            )}
          </SidebarItemGroup>
          <SidebarItemGroup>
            <SidebarItem
              href="/authentication/sign-in"
              icon={HiLockClosed}
              active={currentPage === "/authentication/sign-in"}
            >
              Login
            </SidebarItem>
            <SidebarItem href="#" icon={HiClipboard}>
              Documentation
            </SidebarItem>
            <SidebarItem href="#" icon={HiChartSquareBar}>
              Components
            </SidebarItem>
            <SidebarItem href="#" icon={HiInformationCircle}>
              Help
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </FlowbiteSidebar>
    </div>
  );
};

export default Sidebar;
