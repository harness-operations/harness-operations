import { test, expect } from '@playwright/test';

async function choose(page, goal = 'coding', mode = 'developer') {
  await page.goto('/choose/');
  await page.locator(`input[name="goal"][value="${goal}"]`).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator(`input[name="mode"][value="${mode}"]`).check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
}

test('chooser preserves focus, supports back/edit/reset, and explains suggestions', async ({ page }) => {
  await page.goto('/choose/');
  await expect(page.locator('[data-next]')).toBeDisabled();
  const first = page.locator('input[name="goal"][value="coding"]');
  await first.focus(); await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Continue', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-step="1"] [data-step-heading]')).toBeFocused();
  await page.locator('input[name="mode"][value="developer"]').focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Continue', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('[data-step="2"] [data-step-heading]')).toBeFocused();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('input[name="mode"][value="developer"]')).toBeChecked();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Skip interests' }).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#chooser-results-heading')).toBeFocused();
  const cards = page.locator('[data-result-id]:visible');
  expect(await cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(4);
  await expect(cards.first().locator('[data-why]')).toContainText('Reviewed catalog fields:');
  await expect(cards.first()).toContainText('Reviewed interface');
  await page.getByRole('button', { name: 'Edit answers' }).click();
  await expect(first).toBeChecked();
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.locator('[data-step="0"] [data-step-heading]')).toBeFocused();
  await expect(page.locator('input:checked')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toBeDisabled();
});

test('everyday application requests expose a coverage gap instead of developer substitutes', async ({ page }) => {
  await choose(page, 'everyday', 'application');
  await expect(page.locator('[data-preference-gap]')).toBeVisible();
  await page.getByRole('button', { name: 'Show options' }).click();
  await expect(page.locator('[data-gap]')).toBeVisible();
  await expect(page.locator('[data-result-id]:visible')).toHaveCount(0);
  await expect(page.locator('[data-gap]')).toContainText('does not mean no suitable tools exist');
});

test('interests can be skipped, changing goals clears irrelevant interests, and show-all is unranked', async ({ page }) => {
  await choose(page, 'explore', 'any');
  await page.locator('input[value="voice"]').check();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.locator('input[value="coding"]').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('input[value="voice"]')).not.toBeChecked();
  await page.getByRole('button', { name: 'Start over' }).click();
  await page.locator('input[value="explore"]').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.locator('input[value="any"]').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Skip interests' }).click();
  await expect(page.locator('[data-result-id]:visible')).toHaveCount(4);
  await page.getByRole('button', { name: 'Show all matching entries' }).click();
  const names = await page.locator('[data-result-id]:visible h3').allTextContents();
  expect(names.length).toBeGreaterThan(4);
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')));
  await expect(page.locator('#chooser-results-heading')).toBeFocused();
});

test('chooser sends no answers and creates no browser persistence', async ({ page }) => {
  await choose(page);
  await page.waitForLoadState('networkidle');
  const storageBefore = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) }));
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: 'Skip interests' }).click();
  await expect(page.locator('[data-results]')).toBeVisible();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) })))
    .toEqual(storageBefore);
  await page.reload();
  await expect(page.locator('input:checked')).toHaveCount(0);
});

test('no-JavaScript visitors get working discovery links', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/choose/');
  await expect(page.locator('noscript p')).toContainText('interactive chooser needs JavaScript');
  await expect(page.locator('noscript p')).toBeVisible();
  await expect(page.locator('[data-chooser]')).toBeHidden();
  await page.locator('[data-chooser-fallback] a[href="/capabilities/"]').click();
  await expect(page.getByRole('heading', { level: 1, name: 'Explore capabilities' })).toBeVisible();
  await context.close();
});

test('legacy pages remain archived with useful original fragments and no search indexing', async ({ page }) => {
  for (const route of ['/model/', '/overview/', '/principles/', '/governance/', '/terminology/']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Archived:');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.getByText('Archived design material.', { exact: true })).toBeVisible();
    await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
  }
  await page.goto('/model/');
  const fragment = await page.locator('main h2[id]').first().getAttribute('id');
  expect(fragment).toBeTruthy();
  await page.goto(`/model/#${fragment}`);
  await expect(page.locator(`[id="${fragment}"]`)).toBeVisible();
  await page.goto('/apply/from-harness-engineering/#stop-is-not-one-state');
  await expect(page.locator('#stop-is-not-one-state')).toBeVisible();
});

test('capability pages have a single primary heading, source links, and scoped evidence', async ({ page }) => {
  for (const topic of ['tools', 'context', 'code', 'browser-computer', 'background', 'coordination', 'permissions', 'evidence']) {
    await page.goto(`/capabilities/${topic}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'A practical example' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What to look out for' })).toBeVisible();
    expect(await page.locator('main a[href^="https://"]').count()).toBeGreaterThan(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test('capture light and dark discovery layouts without overflow', async ({ page }, testInfo) => {
  for (const theme of ['light', 'dark']) {
    // Test OS preference on mobile too, where the splash dropdown is hidden.
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const hero = page.locator('img[src="/images/hero-use-cases-selected.avif"]');
    await expect(hero).toBeVisible();
    await expect.poll(() => hero.evaluate((img) => [img.naturalWidth, img.naturalHeight])).toEqual([1916, 821]);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`home-${theme}.png`), fullPage: true });
    await choose(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`chooser-${theme}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Skip interests' }).click();
    await expect(page.locator('[data-results]')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`shortlist-${theme}.png`), fullPage: true });
  }
});
