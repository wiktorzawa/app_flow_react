import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';

interface SidebarContextProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggle: () => void;
  isOpenOnMobile: boolean;
  setIsOpenOnMobile: (value: boolean) => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarProvider({
  initialCollapsed = false,
  children,
}: PropsWithChildren<{ initialCollapsed?: boolean }>) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);

  function toggle() {
    setIsCollapsed(!isCollapsed);
  }

  function toggleMobile() {
    setIsOpenOnMobile(!isOpenOnMobile);
  }

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggle,
        isOpenOnMobile,
        setIsOpenOnMobile,
        toggleMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebarContext must be used within the SidebarContext provider!');
  }

  return context;
}
