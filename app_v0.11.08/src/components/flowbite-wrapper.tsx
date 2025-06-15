import type { FC } from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

const FlowbiteWrapper: FC = function () {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    // Dodaj listener dla zmian theme
    const handleStorageChange = () => {
      setDark(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <PersistFlowbiteThemeToLocalStorage dark={dark} setDark={setDark} />
      <Outlet />
    </div>
  );
};

interface PersistFlowbiteThemeToLocalStorageProps {
  dark: boolean;
  setDark: (dark: boolean) => void;
}

const PersistFlowbiteThemeToLocalStorage: FC<PersistFlowbiteThemeToLocalStorageProps> =
  function ({ dark }) {
    useEffect(() => {
      localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    return <></>;
  };

export default FlowbiteWrapper;
