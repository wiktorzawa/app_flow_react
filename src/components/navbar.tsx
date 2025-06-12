/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Label,
  Navbar,
  NavbarBrand,
  TextInput,
} from "flowbite-react";
import {
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiMenuAlt1,
  HiOutlineTicket,
  HiSearch,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
  HiX,
} from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
const ExampleNavbar: FC = function () {
  const { isOpenOnMobile, setIsOpenOnMobile, toggle } = useSidebarContext();

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <>
              {/* Przycisk dla mobilnych urządzeń */}
              <button
                onClick={() => setIsOpenOnMobile(!isOpenOnMobile)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:hidden"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnMobile && isSmallScreen() ? <HiX className="h-6 w-6" /> : <HiMenuAlt1 className="h-6 w-6" />}
              </button>

              {/* Przycisk dla desktopa */}
              <button
                onClick={toggle}
                className="mr-3 hidden cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar width</span>
                <HiMenuAlt1 className="h-6 w-6" />
              </button>
            </>
            <NavbarBrand href="/">
              <img alt="" src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Flowbite</span>
            </NavbarBrand>
            <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                size={32}
                type="search"
              />
            </form>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpenOnMobile(!isOpenOnMobile)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <NotificationBellDropdown />
              <AppDrawerDropdown />
              <DarkThemeToggle />
            </div>
            <div className="hidden lg:block">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

const NotificationBellDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Notifications</span>
          <HiBell className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
        </span>
      }
    >
      <div className="max-w-[24rem]">
        <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          Notifications
        </div>
        <div>
          <DropdownItem>
            <div className="flex py-3">
              <div className="shrink-0">
                <img alt="" src="../images/users/bonnie-green.png" className="h-11 w-11 rounded-full" />
                <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-primary-700 dark:border-gray-700">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                  </svg>
                </div>
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                  New message from&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">Bonnie Green</span>: "Hey, what's up?
                  All set for the presentation?"
                </div>
                <div className="text-xs font-medium text-primary-700 dark:text-primary-400">a few moments ago</div>
              </div>
            </div>
          </DropdownItem>
        </div>
        <a
          href="#"
          className="block rounded-b-xl bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
        >
          <div className="inline-flex items-center gap-x-2">
            <HiEye className="h-6 w-6" />
            <span>View all</span>
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

const AppDrawerDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
        </span>
      }
    >
      <div className="block rounded-t-lg border-b bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-white">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiShoppingBag className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Sales</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiUsers className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Users</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiInbox className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Inbox</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiUserCircle className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiCog className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Settings</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiCurrencyDollar className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Pricing</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiOutlineTicket className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Billing</div>
        </DropdownItem>
        <DropdownItem className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiLogout className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Logout</div>
        </DropdownItem>
      </div>
    </Dropdown>
  );
};

const UserDropdown: FC = function () {
  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("username") || "admin@msbox.com";

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    window.location.href = "/authentication/sign-in";
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar alt="" img="../images/users/neil-sims.png" rounded size="sm" />
        </span>
      }
    >
      <DropdownHeader>
        <span className="block text-sm font-bold">{userRole || "Użytkownik"}</span>
        <span className="block truncate text-sm font-medium">{userEmail}</span>
      </DropdownHeader>
      <DropdownItem href="/">Dashboard</DropdownItem>
      <DropdownItem href="/users/settings">Ustawienia</DropdownItem>
      {userRole === "admin" && <DropdownItem href="/users/list">Zarządzaj użytkownikami</DropdownItem>}
      <DropdownDivider />
      <DropdownItem onClick={handleLogout}>Wyloguj</DropdownItem>
    </Dropdown>
  );
};

export default ExampleNavbar;
