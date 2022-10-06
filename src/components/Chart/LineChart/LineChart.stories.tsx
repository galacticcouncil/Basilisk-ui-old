import { Story } from '@storybook/react'
import { StorybookWrapper } from '../../../misc/StorybookWrapper'
import { assetPair, createDataset, createLBPDataset } from '../mockDataset'
import cssColors from './../../../misc/colors.module.scss'
import { LineChart, LineChartProps } from './LineChart'

const primaryDataset = createDataset(assetPair, 60)

const args = {
  primaryDataset,
  onHandleTooltip: console.log
}

export default {
  title: 'components/Chart/LineChart',
  component: LineChart,
  args: args,
  argTypes: {
    from: {
      control: {
        type: 'date'
      }
    },
    to: {
      control: {
        type: 'date'
      }
    }
  }
}

const Template: Story<LineChartProps> = (args) => (
  <StorybookWrapper>
    <div
      style={{
        height: '20rem',
        backgroundColor: cssColors.gray2
      }}
    >
      <LineChart {...args} />
    </div>
  </StorybookWrapper>
)

export const Default = Template.bind({})
export const LBP = Template.bind({})

const LBPDatasets = createLBPDataset(assetPair, 60)

LBP.args = {
  primaryDataset: LBPDatasets.primaryDataset,
  secondaryDataset: LBPDatasets.secondaryDataset
}
