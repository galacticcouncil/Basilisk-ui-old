#  Component Library Testing Strategy

hey we're all friends here,  and we want our testing experience to be a joy.  Together we can!

Anyway,  our component testing strategy is based on a combination of storybook `stories`,  and `playwright`.

##   Dev Flow

Stories.  Stories my friend.  Testing our UIs in a unit-testing-kind-of-way means testing stories.  

We don't create new UI building blocks without creating a `.stories.tsx` for each building block.  Thank you <3.  

When a `.stories.tsx` is done,  we test and screenshot each aspect, variation, and interaction of that story with Playwrite in a `.stories.test.tsx` file.  **The screenshots must be generated _before_ merging to main branch**. 

- You'll see that running a new `stories.test.tsx` file that tests for a screenshot,  but doesn't _have_ a screenshot yet, will fail. _But_ even though it fails, Playwrite will take a screenshot of whatever is there,  and use it for comparison subsequently. It will tell you it did that in the console.  

- `yarn storybook:test` after starting storybook to run the `.stories.test` files with Playwright

- `yarn test:stories:ci` is a one-size-fits-all-script that'll run the entire storybook/playwright testing infrastructure.  


Use Playwrite affordances to run specific stories/tests:  
- storybook must be running
- [Playwrite has a CLI](https://playwright.dev/docs/test-cli) 

##   Examples

- Best to look in this repo at the `.stories.test.ts` files and their corresponding `.stories.tsx` files.

##  Links

- https://playwright.dev/
- https://storybook.js.org/docs/react/writing-stories/introduction