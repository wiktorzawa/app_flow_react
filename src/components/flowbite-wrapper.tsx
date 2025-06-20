import type { FC } from 'react';
import { Outlet } from 'react-router';

const FlowbiteWrapper: FC = function () {
  return <Outlet />;
};

export default FlowbiteWrapper;
