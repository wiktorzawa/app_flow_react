"use client";
import { useEffect, useState, type FC, type ReactNode } from "react";

interface NoSSRComponentProps {
  children: ReactNode;
}

const NoSSRComponent: FC<NoSSRComponentProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
};

export default NoSSRComponent;
