import { LPAssetIcon } from './LPAssetIcon';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import {
  Centered as RowCenteredStory,
} from '../Row/Row.stories';
import { Asset } from '../Row/Row';

export default {
  title: 'components/AssetList/Components/LPAssetIcon',
  component: LPAssetIcon,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof LPAssetIcon>;

const Template: ComponentStory<typeof LPAssetIcon> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ width: '460px' }}>
        <LPAssetIcon {...args} />
      </div>
    </StorybookWrapper>
  );
};

// TODO: WIP
export const Default = Template.bind({});
Default.args = {
  assets: [
    RowCenteredStory.args?.asset as Asset,
    RowCenteredStory.args?.asset as Asset,
  ],
  outlineColor: '#363641',
};
