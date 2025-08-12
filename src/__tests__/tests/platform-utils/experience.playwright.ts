import { test, expect } from '@playwright/test';

test('utils.experience.title.set', async ({ page }) => {
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  let title = await page.title();

  expect(title).toBe('1FE Starter App');

  // click button to set title and the title should change to "hello world"
  await page.click('button[data-qa="utils.experience.title.set"]');

  title = await page.title();

  const expectedTitle = /hello world/i;
  expect(title).toMatch(expectedTitle);
});

test('utils.experience.title.get', async ({ page }) => {
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe('1FE Starter App');
    await dialog.dismiss();
  });

  await page.click('button[data-qa="utils.experience.title.get"]');
});
