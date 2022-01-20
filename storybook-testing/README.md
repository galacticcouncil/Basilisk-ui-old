*last updated january 2022

#   testing strategy/thinking

hey we're all friends here,  and we want our testing experience to be a joy.  Together we can!

anyway,  what we've got right now is a combination of storybook's latest add-on `interactions`,  and `playwright`.  This is cutting edge stuff.  Why did we choose these?  Because storybook is creating the full component-workshop-package
- see your components
- document your components
- interact with your components ( via `interactions` )
- test your components ( via `interactions` )
- all with a lovely GUI

And what about Playwright.  Storybook is integrating with playwright.  We use playwright in our e2e testing.  Playwright is the new hottness.  So far it's been simple,  powerful,  and feature-rich. 

storybook `interactions` lacks reporting,  so we are leaning on Playwright for that.  We also may want to stick to one testing API,  so that e2e testing is the same as 'component'/stories testing.  We don't know if `interactions` will impose a disparate DOM selecting API,  etc.  We'll see.

##   dev flow

stories.  stories my friend.  testing our uis in a unit-testing-kind-of-way means testing stories.  

We don't create new ui building blocks without creating a story for each building block.  Thank you <3.  

Some UI building blocks are interactive.  Interactive means a user can change the UI state in some way.  We describe/document the interactive behavior of our UI building blocks using the storybook add-on [`interactions`](https://storybook.js.org/docs/react/essentials/interactions).  Leaveraging  `interactions` in this way will pay dividends because the Storybook developers are commited to building [beautiful developer experiences](https://storybook.js.org/blog/interaction-testing-sneak-peek/) around `interactions`.  We want that for each other. 

When a story is done,  we test each aspect, variation, and interaction of that story with Playwrite. The `test:stories:ci` npm script is a one-size-fits-all-script that'll run the entire storybook/playwright testing infrastructure.  Use Storybook and Playwrite affordances to run specific stories/tests.  
- [Storybook has a test-runner](https://storybook.js.org/addons/@storybook/test-runner) installed with --watch capability that will smoke test your stories and interactions
- [Playwrite has a CLI](https://playwright.dev/docs/test-cli) 

##   example

- Interactions ( the .play functionality ) programatically interact 👇  with the UI

```js
    // LoginForm.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { within, userEvent } from '@storybook/testing-library';

import { LoginForm } from './LoginForm';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Form',
  component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

const Template: ComponentStory<typeof LoginForm> = (args) => <LoginForm {...args} />;

export const EmptyForm = Template.bind({});

export const FilledForm = Template.bind({});
FilledForm.play = async ({ canvasElement }) => {
  // Starts querying the component from it's root element
  const canvas = within(canvasElement);

  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com', {
    delay: 100,
  });
  await userEvent.type(canvas.getByTestId('password'), 'a-random-password', {
    delay: 100,
  });

  // See https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'));
};
```

- With Playwright, you can write a test to check if the inputs are filled and match the story,  and capture a screenshot:

```js
// LoginForm.test.ts

const { test, expect } = require('@playwright/test');

test('Login Form inputs', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-login-form--example');
  const email = await page.inputValue('#email');
  const password = await page.inputValue('#password');
  
  await expect(email).toBe('your-own-emailaddress@provider.com');
  await expect(password).toBe('a-random-password');
  await expect(page.screenshot()).toMatchSnapshot('login-form.png');
});
```

**see our `Button` component for another example**


##  links

- https://playwright.dev/
- https://storybook.js.org/docs/react/writing-stories/introduction


##   aspirations

when [Storybook test-runner](https://storybook.js.org/addons/@storybook/test-runner) comes with reporting,  and perhaps other features ( Storybook 6.5 coming maybe March 2022 ),  I hope to run Playwright _inside_ `.stories` files' `interactions`.  [That looks like the direction things are going](https://storybook.js.org/blog/interaction-testing-sneak-peek/).