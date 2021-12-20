import { ReactComponent as HelpIcon } from './svg/HelpIcon.svg';
import { ReactComponent as NotificationActiveIcon } from './svg/NotificationActiveIcon.svg';
import { ReactComponent as NotificationInactiveIcon } from './svg/NotificationInactiveIcon.svg';
import { ReactComponent as DropdownArrowIcon } from './svg/DropdownArrowIcon.svg';

export enum IconType {
  HELP = 'HELP',
  NOTIFICATION_ACTIVE = 'NOTIFICATION_ACTIVE',
  NOTIFICATION_INACTIVE = 'NOTIFICATION_INACTIVE',
  DROPDOWN_ARROW = 'DROPDOWN_ARROW',
}

export interface IconsProps {
  type: IconType;
}

export const Icon = ({ type }: IconsProps) => {
  switch (type) {
    case IconType.HELP:
      return <HelpIcon />;
    case IconType.NOTIFICATION_ACTIVE:
      return <NotificationActiveIcon />;
    case IconType.NOTIFICATION_INACTIVE:
      return <NotificationInactiveIcon />;
    case IconType.DROPDOWN_ARROW:
      return <DropdownArrowIcon />;
  }
};
