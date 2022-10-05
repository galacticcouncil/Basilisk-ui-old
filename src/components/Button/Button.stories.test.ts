import { test, expect } from '@playwright/test'

test('Default Button', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}components-button-button--default`)
  expect(await page.screenshot()).toMatchSnapshot('default-button.png')
})

test('Secondary Button', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}components-button-button--secondary`)
  expect(await page.screenshot()).toMatchSnapshot('secondary-button.png')
})
