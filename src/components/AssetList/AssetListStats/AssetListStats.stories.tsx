import { AssetListStats } from './AssetListStats';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';

export default {
  title: 'components/AssetList/AssetListStats',
  component: AssetListStats,
  argTypes: {},
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
  spendableAssetsValue: '1 564',
  spendableAssetsDecimalValue: '56',
  lockedValue: '2 300',
  lockedDecimalValue: '52',
  totalValue: '13 100',
  totalDecimalValue: '52',
};

export const AssetList = Template.bind({});
AssetList.args = {
  spendableAssetsValue: '1 564',
  spendableAssetsDecimalValue: '56',
  lockedValue: '2 300',
  lockedDecimalValue: '52',
  totalValue: '13 100',
  totalDecimalValue: '52',
};
