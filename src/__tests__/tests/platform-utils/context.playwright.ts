import { test, expect } from '@playwright/test';

test('Context functions in @internal/generic-child-widget', async ({
  page,
}) => {
  // Navigate to the app
  await page.goto('http://localhost:3001/widget-starter-kit/utils');

  const resultElement = page.getByTestId('wsk.context.result.container');

  await expect(resultElement).toHaveText('');

  await page.getByTestId('utils.context.self.btn').click();

  await page.waitForTimeout(100);

  const selfContent = JSON.parse((await resultElement.textContent()) || '{}');
  expect(selfContent.widgetId).toContain('@1fe/widget-starter-kit');
});
