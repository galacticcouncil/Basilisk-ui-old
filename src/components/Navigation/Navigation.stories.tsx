import { Navigation } from './Navigation';
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'components/Navigation',
    component: Navigation,
} as ComponentMeta<typeof Navigation>

const Template: ComponentStory<typeof Navigation> = (props) => {
    return <Navigation {...props}/>
}

export const Default = Template.bind({});
Default.args = {
    extensionIsAvailable: true
}