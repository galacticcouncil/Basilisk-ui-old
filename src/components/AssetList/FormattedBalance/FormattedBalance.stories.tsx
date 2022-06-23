import { FormattedBalance } from './FormattedBalance';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { Centered as RowStory } from '../Row/Row.stories';
import { Asset } from '../Row/Row';

export default {
  title: 'components/AssetList/Components/FormattedBalance',
  component: FormattedBalance,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof FormattedBalance>;

const Template: ComponentStory<typeof FormattedBalance> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <FormattedBalance {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  assetBalance: { value: '2131.13', id: '0' },
};

export const NonNativeAsset = Template.bind({});
NonNativeAsset.args = {
  assetBalance: { value: '2131.13', id: '1' },
  assets: [RowStory.args?.asset as Asset],
};
