import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useRef } from 'react';
import cssColors from './../../misc/colors.module.scss';
import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { Wallet } from './Wallet';
import { toPrecision12 } from '../../hooks/math/useToPrecision';

export default {
  title: 'components/Wallet',
  component: Wallet,
  args: {
    extensionLoading: false,
    isExtensionAvailable: true,
    account: {
      name: 'Alice 1',
      balances: [{ assetId: '0', balance: toPrecision12('100200') }],
      id: 'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH',
      isActive: true,
      vestingSchedule: {},
    },
    accounts: [
      {
        name: 'Alice 1',
        balances: [{ assetId: '0', balance: toPrecision12('100200') }],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH',
        isActive: true,
        vestingSchedule: {},
      },
      {
        name: 'Kusama snekmaster',
        balances: [{ assetId: '0', balance: toPrecision12('0') }],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzxaayLJA4TuPcKKboBkJ5GH',
        isActive: false,
        vestingSchedule: {},
      },
    ],
    accountsLoading: false,
    onAccountSelected: () => {
      return Promise.resolve();
    },
    onAccountCleared: () => {
      return Promise.resolve();
    },
    setAccountSelectorOpen: () => {
      console.log('toggle modal open');
    },
  },
} as ComponentMeta<typeof Wallet>;

const Template: ComponentStory<typeof Wallet> = (args) => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <StorybookWrapper>
      <div
        style={{
          margin: '-1rem',
          padding: '1rem',
          backgroundColor: cssColors.gray2,
        }}
      >
        {/* This is where the underlying modal should be rendered */}
        <div ref={modalContainerRef} />

        {/*
                        Pass the ref to the element above, so that the Wallet
                        can render the modal there.
                    */}
        <div
          style={{
            width: '360px',
          }}
        >
          <Wallet {...args} modalContainerRef={modalContainerRef} />
        </div>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
export const NoAccountConnected = Template.bind({});
NoAccountConnected.args = {
  account: undefined,
};
export const AccountsLoading = Template.bind({});
AccountsLoading.args = {
  accountsLoading: true,
};
export const NoAccountsAvailable = Template.bind({});
NoAccountsAvailable.args = {
  account: undefined,
  accounts: [],
};
export const ExtensionUnavailable = Template.bind({});
ExtensionUnavailable.args = {
  isExtensionAvailable: false,
  account: undefined,
  accounts: [],
};
export const LoadingData = Template.bind({});
LoadingData.args = {
  extensionLoading: true,
};
