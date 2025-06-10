import { Footer, FooterLinkGroup, FooterLink } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { SidebarProvider, useSidebarContext } from "../context/SidebarContext";
import classNames from "classnames";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({ children, isFooter = true }) {
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex items-start pt-16">
        <Sidebar />
        <MainContent isFooter={isFooter}>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({ children, isFooter }) {
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();

  return (
    <main
      className={classNames(
        "overflow-y-auto relative w-full h-full bg-gray-50 dark:bg-gray-900",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64"
      )}
    >
      {children}
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter: FC = function () {
  return (
    <>
      <Footer container>
        {/* Zmieniono Footer.LinkGroup na FooterLinkGroup */}
        <FooterLinkGroup>
          {/* Zmieniono Footer.Link na FooterLink */}
          <FooterLink href="#" className="mr-3 mb-3 lg:mb-0">
            Terms and conditions
          </FooterLink>
          <FooterLink href="#" className="mr-3 mb-3 lg:mb-0">
            Privacy Policy
          </FooterLink>
          <FooterLink href="#" className="mr-3">
            Licensing
          </FooterLink>
          <FooterLink href="#" className="mr-3">
            Cookie Policy
          </FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinkGroup>
        {/* Zmieniono Footer.LinkGroup na FooterLinkGroup */}
        <FooterLinkGroup>
          <div className="flex gap-4 md:gap-0">
            {/* Zmieniono Footer.Link na FooterLink */}
            <FooterLink href="#" className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300">
              <MdFacebook className="text-lg" />
            </FooterLink>
            <FooterLink href="#" className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300">
              <FaInstagram className="text-lg" />
            </FooterLink>
            <FooterLink href="#" className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300">
              <FaTwitter className="text-lg" />
            </FooterLink>
            <FooterLink href="#" className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300">
              <FaGithub className="text-lg" />
            </FooterLink>
            <FooterLink href="#" className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300">
              <FaDribbble className="text-lg" />
            </FooterLink>
          </div>
        </FooterLinkGroup>
      </Footer>
      <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; 2019-2022 Flowbite.com. All rights reserved.
      </p>
    </>
  );
};

export default NavbarSidebarLayout;
