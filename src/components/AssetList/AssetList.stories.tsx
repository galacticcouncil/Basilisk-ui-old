import { AssetList } from './AssetList';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { Default as AssetListStatsStory } from './AssetListStats/AssetListStats.stories';
import { Default as AssetTableStory } from './AssetTable/AssetTable.stories';
import { AssetListStatsProps } from './AssetListStats/AssetListStats';
import { AssetTableProps } from './AssetTable/AssetTable';

export default {
  title: 'components/AssetList/AssetList',
  component: AssetList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetList>;

const Template: ComponentStory<typeof AssetList> = (args) => {
  return (
    <StorybookWrapper>
      <div
        style={{
          background:
            'radial-gradient(89.2% 89.2% at 50.07% 87.94%, #008A69 0%, #262F31 88.52%), linear-gradient(0deg, #2C3335, #2C3335)',
        }}
      >
        <AssetList {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  stats: AssetListStatsStory.args as AssetListStatsProps,
  table: AssetTableStory.args as AssetTableProps,
};
