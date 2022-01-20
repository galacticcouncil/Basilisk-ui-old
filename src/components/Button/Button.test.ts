import { test, expect } from '@playwright/test';

test('Default button', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=components-button-button--default'
  );

  const button = await page.locator('text=click here');

  expect(button).toBeTruthy();
  expect(await page.screenshot()).toMatchSnapshot('default-button.png');
});

test('secondary button', async ({ page }) => {
  await page.goto(
    'http://localhost:6006/iframe.html?id=components-button-button--secondary'
  );

  const button = await page.locator('text=click here');

  expect(button).toBeTruthy();
  expect(await page.screenshot()).toMatchSnapshot('secondary-button.png');
});
