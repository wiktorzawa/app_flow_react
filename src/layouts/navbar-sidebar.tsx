import { Footer, FooterLink, FooterLinkGroup } from 'flowbite-react';
import type { FC, PropsWithChildren } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { MdFacebook } from 'react-icons/md';
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SidebarProvider, useSidebarContext } from '../context/SidebarContext';
import classNames from 'classnames';

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter = true,
}) {
  return (
    <SidebarProvider initialCollapsed={false}>
      <Navbar />
      <div className="flex items-start pt-16">
        <Sidebar />
        <MainContent isFooter={isFooter}>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  const { isCollapsed } = useSidebarContext();

  return (
    <main
      className={classNames(
        'relative h-full w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900 transition-all duration-300',
        {
          'lg:ml-64': !isCollapsed,
          'lg:ml-16': isCollapsed,
        }
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
        <div className="flex w-full flex-col items-center justify-between gap-y-6 lg:flex-row">
          <FooterLinkGroup>
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
          <FooterLinkGroup>
            <div className="flex gap-4 md:gap-0">
              <FooterLink href="#" className="*:hover:text-black dark:*:hover:text-gray-300">
                <MdFacebook className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black dark:*:hover:text-gray-300">
                <FaInstagram className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black dark:*:hover:text-gray-300">
                <FaTwitter className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black dark:*:hover:text-gray-300">
                <FaGithub className="text-lg" />
              </FooterLink>
              <FooterLink href="#" className="*:hover:text-black dark:*:hover:text-gray-300">
                <FaDribbble className="text-lg" />
              </FooterLink>
            </div>
          </FooterLinkGroup>
        </div>
      </Footer>
      <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; 2019-2022 Flowbite.com. All rights reserved.
      </p>
    </>
  );
};

export default NavbarSidebarLayout;
