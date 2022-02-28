import React from 'react';
import { ReactComponent as HelpIcon } from './assets/HelpIcon.svg';
import { ReactComponent as NotificationActiveIcon } from './assets/NotificationActiveIcon.svg';
import { ReactComponent as NotificationInactiveIcon } from './assets/NotificationInactiveIcon.svg';
import { ReactComponent as DropdownArrowIcon } from './assets/DropdownArrowIcon.svg';
import { ReactComponent as CancelIcon } from './assets/Cancel.svg';
import { ReactComponent as BasiliskLogoFull } from './assets/BasiliskLogoFull.svg';
import { ReactComponent as AssetSwitchIcon } from './assets/AssetSwitchIcon.svg';

const Icons = {
  Help: () => <HelpIcon />,
  NotificationActive: () => <NotificationActiveIcon />,
  NotificationInactive: () => <NotificationInactiveIcon />,
  DropdownArrow: () => <DropdownArrowIcon />,
  Cancel: () => <CancelIcon />,
  BasiliskLogoFull: () => <BasiliskLogoFull />,
  AssetSwitch: () => <AssetSwitchIcon />,
} as const;

type IconNames = keyof typeof Icons;

const Icon: React.FC<{ name: IconNames }> = ({ name }) => Icons[name]();
export default Icon;
