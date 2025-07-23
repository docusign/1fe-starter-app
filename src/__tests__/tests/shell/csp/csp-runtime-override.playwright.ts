import { test, expect } from '@playwright/test';

const runtimeOverride = {
  '@1fe/widget-starter-kit': {
    headers: {
      csp: {
        enforced: {
          imgSrc: ['https://overriden-test.com'],
        },
      },
    },
  },
};

const wskRuntimeOverrideUrl = `http://localhost:3001/widget-starter-kit?runtime_config_overrides=${JSON.stringify(runtimeOverride)}`;

test('should override csp only on integration', async ({ page }) => {
  // Listen to any CSP violation errors in console
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const pageResponse = page.waitForResponse(
    (response) =>
      response.url().includes('http://localhost:3001/widget-starter-kit') &&
      response.status() === 200,
  );

  await page.goto(wskRuntimeOverrideUrl);
  await page.waitForLoadState('load');

  // Grab csp from page response
  const headers = (await pageResponse).headers();
  const cspHeader = headers['content-security-policy'];

  expect(cspHeader).toContain('https://overriden-test.com');

  // should have no csp violations in the console.
  const cspViolations = consoleErrors.filter((error: string) =>
    error.includes('Content Security Policy'),
  );
  expect(cspViolations).toEqual([]);
});
