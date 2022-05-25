import { AssetIcon } from './AssetIcon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import BSX from './assets/BSX.svg';
import BSXChain from './assets/BSXChain.svg';

export default {
  title: 'components/ConfirmationScreen/AssetIcon',
  component: AssetIcon,
  argTypes: {
    text: {
      type: 'string',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetIcon>;

const Template: ComponentStory<typeof AssetIcon> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <AssetIcon {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const WithAssetIcon = Template.bind({});
WithAssetIcon.args = { assetIcon: BSX };

export const WithChainIcon = Template.bind({});
WithChainIcon.args = { chainIcon: BSXChain };

export const WithBothIcons = Template.bind({});
WithBothIcons.args = { assetIcon: BSX, chainIcon: BSXChain };

export const WithNoneIcons = Template.bind({});
WithNoneIcons.args = {};
