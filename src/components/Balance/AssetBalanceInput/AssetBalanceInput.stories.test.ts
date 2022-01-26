import { test, expect } from '@playwright/test';

test('Default AssetBalanceInput', async ({ baseURL, page }) => {
  await page.goto(`${baseURL}components-balance-assetbalanceinput--default`);
  expect(await page.screenshot()).toMatchSnapshot(
    'default-assetbalanceinput.png'
  );
});

test('inputs accept numbers and "." not other characters', async ({
  baseURL,
  page,
}) => {
  await page.goto(`${baseURL}components-balance-assetbalanceinput--default`);
  const inputs = await page.$$('#root input');

  for (const input of inputs) {
    // typing this '!@#$%^%&*()_+{}|[]:";<>?,./ 100.00 be' string in breaks it..
    await input.type('as 100.00 be', { delay: 100 });
    const value = await input.getProperty('value');
    const valueAsJson = await value.jsonValue();
    expect(await valueAsJson).toBe('100.00');
  }

  expect(await page.screenshot()).toMatchSnapshot(
    'numbersNotLetters-assetbalanceinput.png'
  );
});
