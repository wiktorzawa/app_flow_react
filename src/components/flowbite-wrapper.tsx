import { ThemeProvider } from "flowbite-react";
import type { FC } from "react";
import { Outlet } from "react-router";
import flowbiteTheme from "../flowbite-theme";

const FlowbiteWrapper: FC = function () {
  return (
    <ThemeProvider theme={flowbiteTheme}>
      <Outlet />
    </ThemeProvider>
  );
};

export default FlowbiteWrapper;
