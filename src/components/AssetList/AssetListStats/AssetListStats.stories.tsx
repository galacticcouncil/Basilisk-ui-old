import { AssetListStats } from './AssetListStats';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/AssetList/Components/AssetListStats',
  component: AssetListStats,
  argTypes: {
    loading: {
      type: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetListStats>;

const Template: ComponentStory<typeof AssetListStats> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ padding: '20px' }}>
        <AssetListStats {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  spendableAssets: '1 564.56',
  locked: '2 300.52',
  total: '13 100.52',
  loading: false,
};

export const AssetList = Template.bind({});
AssetList.args = {
  spendableAssets: '1 564.56',
  locked: '2 300.52',
  total: '13 100.52',
};

export const Loading = Template.bind({});
Loading.args = {
  spendableAssets: '1 564.56',
  locked: '2 300.52',
  total: '13 100.52',
  loading: true,
};
