import { test, expect } from '@playwright/test';

test('Should successfully Mark Start and Mark End for generic-child-widget', async ({
  page,
}) => {
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.getEntries.result"]',
  );

  await expect(resultElement).not.toContainText('@1fe/sample-widget-start');
  await expect(resultElement).not.toContainText('@1fe/sample-widget-end');

  await page.click('button[data-qa="utils.appLoadTime.get.btn"]');

  await page.waitForTimeout(500);

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  await expect(resultElement).toContainText('@1fe/sample-widget-start');
  await expect(resultElement).toContainText('@1fe/sample-widget-end');
});

test('Should get all entries', async ({ page }) => {
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  await page.click('button[data-qa="utils.appLoadTime.getEntries.btn"]');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.getEntries.result"]',
  );

  await expect(resultElement).toContainText('Entry Type: mark');
});

test('Should mark and measure custom events', async ({ page }) => {
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  const resultElement = page.locator(
    'div[data-qa="utils.appLoadTime.measure.result"]',
  );

  await page.click('button[data-qa="utils.appLoadTime.mark.btn"]');

  await expect(resultElement).toHaveText('Mark started');

  await page.click('button[data-qa="utils.appLoadTime.measure.btn"]');

  await expect(resultElement).toContainText(
    '@1fe/widget-starter-kit-iLove1FESoMuchMarkTest',
  );

  expect(
    /\d+(\.\d+)?/.test((await resultElement.innerText()) || ''),
  ).toBeTruthy();
});
