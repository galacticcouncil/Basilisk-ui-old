import { addMinutes, subMinutes } from 'date-fns';
import { subHours } from 'date-fns/esm';
import { random, times } from 'lodash';
import { StorybookWrapper } from '../../../shared/StorybookWrapper';
import { LineChart } from './LineChart';
import cssColors from './../../../shared/colors.module.scss'

const now = Date.now();
const hourAgo = subMinutes(now, 60);
const demoDataCount = 6;
const jointValue = 3;
const randomDataPoint = () => random(1,5);

const args = {
    primaryDataset: times(demoDataCount)
        .map(i => ({
            x: addMinutes(hourAgo, (i + 1) * 10),
            y: i == (demoDataCount - 1) ? jointValue : randomDataPoint()
        })),
    secondaryDataset: times(demoDataCount)
        .map(i => ({
            x: addMinutes(now, i * 10),
            y: i === 0 ? jointValue : randomDataPoint()
        })),
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

const Template = (args: any) => (
    <StorybookWrapper>
        <div style={{
            backgroundColor: cssColors.gray2,
            width: args.wrapperWidth
        }}>
            <LineChart {...args} />
        </div>
    </StorybookWrapper>
)

export const Default = Template.bind({})