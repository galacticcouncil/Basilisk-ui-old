import { ComponentMeta, ComponentStory } from '@storybook/react'
import { StorybookWrapper } from '../../misc/StorybookWrapper'
import { Button, ButtonKind } from './Button'

export default {
  title: 'components/Button/Button',
  component: Button
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => {
  return (
    <StorybookWrapper>
      <div
        style={{
          width: '380px'
        }}
      >
        <Button {...args}>click here</Button>
      </div>
    </StorybookWrapper>
  )
}

export const Default = Template.bind({})
Default.args = { kind: ButtonKind.Primary }

export const Secondary = Template.bind({})
Secondary.args = { kind: ButtonKind.Secondary }
