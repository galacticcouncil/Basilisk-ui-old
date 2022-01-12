import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StorybookWrapper } from '../../misc/StorybookWrapper';
import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { Button, ButtonKind } from './Button';

export default {
  title: 'components/Button/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  return (
    <StorybookWrapper>
      <div
        style={{
          width: '380px',
        }}
      >
        <Button {...args}>click here</Button>
      </div>
    </StorybookWrapper>
  );
};

export const Default = Template.bind({});
Default.args = { kind: ButtonKind.Primary };
Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole('button'));

  await waitFor(() => expect(args.onClick).toHaveBeenCalled());
};

export const Secondary = Template.bind({});
Secondary.args = { kind: ButtonKind.Secondary };

Secondary.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  const hasSecondaryClass = await canvas
    .getByRole('button')
    .classList.contains('button--secondary');

  await waitFor(() => expect(hasSecondaryClass).toBeTruthy());
};
