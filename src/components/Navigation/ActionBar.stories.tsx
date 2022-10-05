import { ActionBar } from './ActionBar'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { StorybookWrapper } from '../../misc/StorybookWrapper'

export default {
  title: 'components/ActionBar',
  component: ActionBar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof ActionBar>

const Template: ComponentStory<typeof ActionBar> = (props) => (
  <StorybookWrapper>
    <ActionBar
      {...{
        isExtensionAvailable: true,
        extensionLoading: false,
        activeAccountLoading: false,
        accountData: {
          nativeAssetBalance: '1000',
          name: 'Alice',
          address: 'sX00000000000000000000000000000000000000000000000'
        }
      }}
    />

    <br />

    <ActionBar
      {...{
        isExtensionAvailable: true,
        extensionLoading: false,
        activeAccountLoading: false
      }}
    />

    <br />

    <ActionBar
      {...{
        isExtensionAvailable: false,
        extensionLoading: false,
        activeAccountLoading: false,
        accountData: {
          nativeAssetBalance: '1000',
          name: 'Alice',
          address: 'sX00000000000000000000000000000000000000000000000'
        }
      }}
    />

    <br />

    <ActionBar
      {...{
        isExtensionAvailable: true,
        extensionLoading: true,
        activeAccountLoading: false,
        accountData: {
          nativeAssetBalance: '1000',
          name: 'Alice',
          address: 'sX00000000000000000000000000000000000000000000000'
        }
      }}
    />

    <br />

    <ActionBar
      {...{
        isExtensionAvailable: true,
        extensionLoading: false,
        activeAccountLoading: true,
        accountData: {
          nativeAssetBalance: '1000',
          name: 'Alice',
          address: 'sX00000000000000000000000000000000000000000000000'
        }
      }}
    />
  </StorybookWrapper>
)

export const Default = Template.bind({})
