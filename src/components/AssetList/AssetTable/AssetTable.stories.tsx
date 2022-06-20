import { AssetTable } from './AssetTable';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import {
  Default as RowStory,
  Centered as RowStoryCentered,
} from '../Row/Row.stories';
import { RowProps } from '../Row/Row';

export default {
  title: 'components/AssetList/AssetTable',
  component: AssetTable,
  argTypes: {
    handleEdit: {
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
} as ComponentMeta<typeof AssetTable>;

const Template: ComponentStory<typeof AssetTable> = (args) => {
  return (
    <StorybookWrapper>
      <div style={{ padding: '20px' }}>
        <AssetTable {...args} />
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = {
  data: [
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStoryCentered.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
    RowStory.args as RowProps,
  ],
};
