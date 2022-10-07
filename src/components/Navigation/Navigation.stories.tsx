import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { StorybookWrapper } from '../../misc/StorybookWrapper'
import { Navigation } from './Navigation'

export default {
  title: 'components/Navigation',
  component: Navigation,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof Navigation>

const Template: ComponentStory<typeof Navigation> = (props) => (
  <StorybookWrapper>
    <Navigation />
  </StorybookWrapper>
)

export const Default = Template.bind({})
