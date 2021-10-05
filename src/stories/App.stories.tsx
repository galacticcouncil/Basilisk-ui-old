import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import App, { AppProps, Locale } from '../App';


export default {
    title: 'Pages/App',
    component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args: AppProps) => <App {...args} />

export const Default = Template.bind({})
Default.args = {
    locale: Locale.EN
}