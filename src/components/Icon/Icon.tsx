import React from 'react'
import { ReactComponent as AssetSwitchIcon } from './assets/AssetSwitchIcon.svg'
import { ReactComponent as BackIcon } from './assets/Back.svg'
import { ReactComponent as BasiliskLogoFull } from './assets/BasiliskLogoFull.svg'
import { ReactComponent as BasiliskLogoSmall } from './assets/BasiliskLogoSmall.svg'
import { ReactComponent as CancelIcon } from './assets/Cancel.svg'
import { ReactComponent as ChartIcon } from './assets/ChartIcon.svg'
import { ReactComponent as DropdownArrowIcon } from './assets/DropdownArrowIcon.svg'
import { ReactComponent as HelpIcon } from './assets/HelpIcon.svg'
import { ReactComponent as NotificationActiveIcon } from './assets/NotificationActiveIcon.svg'
import { ReactComponent as NotificationInactiveIcon } from './assets/NotificationInactiveIcon.svg'
import { ReactComponent as RightArrowIcon } from './assets/RightArrowIcon.svg'
import { ReactComponent as SettingsIcon } from './assets/Settings.svg'
import { ReactComponent as SwapIcon } from './assets/SwapIcon.svg'

const Icons = {
  AssetSwitch: () => <AssetSwitchIcon />,
  Back: () => <BackIcon />,
  BasiliskLogoFull: () => <BasiliskLogoFull />,
  BasiliskLogoSmall: () => <BasiliskLogoSmall />,
  Cancel: () => <CancelIcon />,
  ChartIcon: () => <ChartIcon />,
  DropdownArrow: () => <DropdownArrowIcon />,
  Help: () => <HelpIcon />,
  NotificationActive: () => <NotificationActiveIcon />,
  NotificationInactive: () => <NotificationInactiveIcon />,
  RightArrow: () => <RightArrowIcon />,
  Settings: () => <SettingsIcon />,
  SwapIcon: () => <SwapIcon />
} as const

type IconNames = keyof typeof Icons

const Icon: React.FC<{ name: IconNames }> = ({ name }) => Icons[name]()
export default Icon
