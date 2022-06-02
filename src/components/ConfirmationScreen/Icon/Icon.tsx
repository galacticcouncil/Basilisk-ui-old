import styled from '@emotion/styled/macro';
import { ReactComponent as WalletIcon } from './assets/WalletIcon.svg';
import { ReactComponent as LoadingIcon } from './assets/LoadingIcon.svg';
import { ReactComponent as UpdateMetadataIcon } from './assets/UpdateMetadataIcon.svg';
import { ReactComponent as ErrorIcon } from './assets/ErrorIcon.svg';
import { ReactComponent as ArrowDownIcon } from './assets/ArrowDownIcon.svg';
import { ReactComponent as ArrowUpIcon } from './assets/ArrowUpIcon.svg';
import { ReactComponent as ArrowAssetPickerIcon } from './assets/ArrowAssetPickerIcon.svg';
import { ReactComponent as MissingAssetIcon } from './assets/MissingAssetIcon.svg';
import { ReactComponent as PolygonUpIcon } from './assets/PolygonUpIcon.svg';
import { ReactComponent as TooltipIcon } from './assets/TooltipIcon.svg';
import { ReactComponent as StepperDoneIcon } from './assets/StepperDoneIcon.svg';
import { ReactComponent as UrlIcon } from './assets/UrlIcon.svg';

export const Icons = {
  Wallet: () => <WalletIcon />,
  Loading: () => <LoadingIcon />,
  UpdateMetadata: () => <UpdateMetadataIcon />,
  Error: () => <ErrorIcon />,
  ArrowDown: () => <ArrowDownIcon />,
  ArrowUp: () => <ArrowUpIcon />,
  ArrowAssetPicker: () => <ArrowAssetPickerIcon />,
  MissingAsset: () => <MissingAssetIcon />,
  PolygonUp: () => <PolygonUpIcon />,
  Tooltip: () => <TooltipIcon />,
  StepperDone: () => <StepperDoneIcon />,
  Url: () => <UrlIcon />,
} as const;

export type IconNames = keyof typeof Icons;

export interface IconProps {
  name: IconNames;
  size?: number;
}

const IconWrapper = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Icon = ({ name, size = 24 }: IconProps) => {
  return <IconWrapper size={size}>{Icons[name]()}</IconWrapper>;
};
