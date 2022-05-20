import styled from '@emotion/styled';
import React from 'react';
import { ReactComponent as WalletIcon } from './assets/WalletIcon.svg';
import { ReactComponent as LoadingIcon } from './assets/LoadingIcon.svg';

export const Icons = {
  Wallet: () => <WalletIcon />,
  Loading: () => <LoadingIcon />,
} as const;

export type IconNames = keyof typeof Icons;

export interface IconProps {
  name: IconNames;
  size?: number;
}

const IconWrapperSC = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Icon = ({ name, size = 24 }: IconProps) => {
  return <IconWrapperSC size={size}>{Icons[name]()}</IconWrapperSC>;
};
