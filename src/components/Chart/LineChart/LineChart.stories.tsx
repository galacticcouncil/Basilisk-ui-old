import { StorybookWrapper } from '../../../misc/StorybookWrapper';
import { LineChart, LineChartProps } from './LineChart';
import cssColors from './../../../misc/colors.module.scss'
import { createDataset, createLBPDataset } from '../mockDataset';
import { assetPair } from '../mockDataset';
import { Story } from '@storybook/react';


 const primaryDataset = createDataset(assetPair, 60);

const args = {
    primaryDataset,
    onHandleTooltip: console.log
};

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
        <div style={{
            height: '20rem',
            backgroundColor: cssColors.gray2,
        }}>
            <LineChart {...args} />
        </div>
    </StorybookWrapper>
)

export const Default = Template.bind({})
export const LBP = Template.bind({})

const LBPDatasets = createLBPDataset(assetPair, 60);

LBP.args = {
    primaryDataset: LBPDatasets.primaryDataset, 
    secondaryDataset: LBPDatasets.secondaryDataset
}