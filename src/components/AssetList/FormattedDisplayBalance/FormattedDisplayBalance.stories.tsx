import { FormattedDisplayBalance } from './FormattedDisplayBalance';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import {
  Centered as RowStory,
  Default as RowDefaultStory,
} from '../Row/Row.stories';
import { Asset } from '../Row/Row';

export default {
  title: 'components/AssetList/Components/FormattedDisplayBalance',
  component: FormattedDisplayBalance,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof FormattedDisplayBalance>;

const Template: ComponentStory<typeof FormattedDisplayBalance> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <FormattedDisplayBalance {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  assetBalance: { value: '2131.13' },
};

export const NativeAsset = Template.bind({});
NativeAsset.args = {
  assetBalance: { value: '2131.13', id: '0' },
  assets: [RowDefaultStory.args?.asset as Asset],
};

export const NonNativeAsset = Template.bind({});
NonNativeAsset.args = {
  assetBalance: { value: '2131.13', id: '1' },
  assets: [RowStory.args?.asset as Asset],
};

export const Euros = Template.bind({});
Euros.args = {
  assetBalance: { value: '2131.13', id: '0' },
  assets: [RowDefaultStory.args?.asset as Asset],
  currency: {
    suffix: '€',
  },
};
