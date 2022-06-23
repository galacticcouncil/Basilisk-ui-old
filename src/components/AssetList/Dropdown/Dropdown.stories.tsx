import { Dropdown } from './Dropdown';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/AssetList/Components/Dropdown',
  component: Dropdown,
  argTypes: {
    handleClick: {
      action: 'clicked',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => {
  return (
    <StorybookWrapper>
      <div
        style={{
          width: '460px',
          padding: '50px 50px 50px 300px',
          background: '#1C1A1F',
        }}
      >
        <Dropdown {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      icon: 'DropdownPlus',
      label: {
        id: 'addLiquidity',
        defaultMessage: 'Add Liquidity',
      },
      onClick: () => {
        console.log('click1');
      },
    },
    {
      icon: 'DropdownDollar',
      label: {
        id: 'setAsFeePaymentAsset',
        defaultMessage: 'Set as Fee Payment Asset',
      },
      onClick: () => {
        console.log('click2');
      },
    },
    {
      icon: 'DropdownFlag',
      label: {
        id: 'claim ',
        defaultMessage: 'Claim',
      },
      onClick: () => {
        console.log('click3');
      },
    },
  ],
};
