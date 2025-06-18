import type { FC } from 'react';
import NavbarSidebarLayout from '../layouts/navbar-sidebar';

const TestyBlokowPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      {/* TODO: Wstaw tutaj komponenty testowe bloków Flowbite Pro */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400">
          Tu wstaw swoje komponenty testowe bloków.
        </p>
      </div>
    </NavbarSidebarLayout>
  );
};

export default TestyBlokowPage;
