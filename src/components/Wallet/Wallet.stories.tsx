import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useRef } from 'react';
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
      name: 'LOOOOOOOONG snekmaster sdkaoskaodkosadkassdksadkoajdjdaosdjasoj',
      balances: [
        { assetId: '0', balance: toPrecision12('100213') },
        { assetId: '1', balance: toPrecision12('300213') },
      ],
      id: 'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH',
      isActive: true,
      vestingSchedule: {},
      source: 'polkadot-js',
    },
    accounts: [
      {
        name: 'Alice 1',
        balances: [{ assetId: '0', balance: toPrecision12('100213') }],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzLoayLJA4TuPcKKboBkJ5GH',
        isActive: true,
        vestingSchedule: {},
        source: 'polkadot-js',
      },
      {
        name: 'Kusama snekmaster',
        balances: [],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzxaayLJA4TuPcKKboBkJ5GH',
        isActive: false,
        vestingSchedule: {},
        source: 'polkadot-js',
      },
      {
        name: 'Kusama snekmaster',
        balances: [{ assetId: '2', balance: toPrecision12('1') }],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzxaayLJA4TuPcKKboBkJ5GH',
        isActive: false,
        vestingSchedule: {},
        source: 'polkadot-js',
      },
      {
        name: 'LOOOOOOOONG snekmaster sdkaoskaodkosadkassdksadkoajdjdaosdjasoj',
        balances: [
          {
            assetId: '0',
            balance: toPrecision12('10010101001000003203302023'),
          },
        ],
        id: 'E7ncQKp4xayUoUdpraxBjT7NzxaayLJA4TuPcKKboBkJ5GH',
        isActive: false,
        vestingSchedule: {},
        source: 'polkadot-js',
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
      <div>
        {/* This is where the underlying modal should be rendered */}
        <div ref={modalContainerRef} />

        {/*
                        Pass the ref to the element above, so that the Wallet
                        can render the modal there.
                    */}
        <div>
          <Wallet {...args} modalContainerRef={modalContainerRef} />
        </div>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
// export const NoAccountConnected = Template.bind({});
// NoAccountConnected.args = {
//   account: undefined,
// };
// export const AccountsLoading = Template.bind({});
// AccountsLoading.args = {
//   accountsLoading: true,
// };
// export const NoAccountsAvailable = Template.bind({});
// NoAccountsAvailable.args = {
//   account: undefined,
//   accounts: [],
// };
// export const ExtensionUnavailable = Template.bind({});
// ExtensionUnavailable.args = {
//   isExtensionAvailable: false,
//   account: undefined,
//   accounts: [],
// };
// export const LoadingData = Template.bind({});
// LoadingData.args = {
//   extensionLoading: true,
// };
