import React from 'react';
import { ReactComponent as HelpIcon } from './assets/HelpIcon.svg';
import { ReactComponent as NotificationActiveIcon } from './assets/NotificationActiveIcon.svg';
import { ReactComponent as NotificationInactiveIcon } from './assets/NotificationInactiveIcon.svg';
import { ReactComponent as DropdownArrowIcon } from './assets/DropdownArrowIcon.svg';

const Icons = {
  Help: () => <HelpIcon />,
  NotificationActive: () => <NotificationActiveIcon />,
  NotificationInactive: () => <NotificationInactiveIcon />,
  DropdownArrow: () => <DropdownArrowIcon />,
} as const;

type IconNames = keyof typeof Icons;

const Icon: React.FC<{ name: IconNames }> = ({ name }) => Icons[name]();
export default Icon;
