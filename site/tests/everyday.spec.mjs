import { test, expect } from '@playwright/test';

const ids = ['chatgpt-consumer-web', 'claude-consumer-web', 'gemini-consumer-web', 'perplexity-consumer-web'];
const visibleIds = (page) => page.locator('[data-result-id]:visible').evaluateAll((cards) => cards.map((card) => card.dataset.resultId));
const noOverflow = async (page) => expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
async function everyday(page) {
  await page.goto('/choose/');
  await page.locator('input[value="everyday"]').check();
  await page.locator('[data-next]').click();
  await page.locator('input[value="application"]').check();
  await page.locator('[data-next]').click();
}

test('everyday visitors get four real web applications with visible scope and evidence', async ({ page }) => {
  await everyday(page);
  await expect(page.locator('[data-everyday-scope]')).toContainText('personal web applications');
  await expect(page.locator('[data-preference-gap]')).toBeHidden();
  await page.locator('[data-skip]').click();
  expect(await visibleIds(page)).toEqual(ids);
  await expect(page.locator('[data-gap]')).toBeHidden();
  await expect(page.locator('[data-more]')).toBeHidden();
  await expect(page.locator('[data-result-count]')).toHaveText('Showing 4 of 4 matching catalog entries.');
  for (const id of ids) {
    const card = page.locator(`[data-result-id="${id}"]`);
    await expect(card).toContainText('Application');
    await expect(card.locator('[data-why]')).toContainText('everyday assistance');
    await expect(card.locator('[data-scope-key="configuration"] + dd')).not.toBeEmpty();
    await expect(card.locator('time')).toHaveAttribute('datetime', /\d{4}-\d{2}-\d{2}/);
    await card.locator('summary').click();
    expect(await card.locator('details a[href^="https://"]').count()).toBeGreaterThanOrEqual(5);
  }
  await noOverflow(page);
});

test('everyday interests narrow by evidence and can be cleared without losing application mode', async ({ page }) => {
  await everyday(page);
  for (const id of ['web-research', 'documents', 'personal-memory']) await page.locator(`input[value="${id}"]`).check();
  await page.locator('[data-next]').click();
  expect(await visibleIds(page)).toEqual(ids.slice(0, 3));
  await expect(page.locator('[data-everyday-scope]')).toContainText('unassessed, not unsupported');
  await page.locator('[data-clear-interests]').click();
  expect(await visibleIds(page)).toEqual(ids);
  await expect(page.locator('[data-summary]')).toContainText('Get everyday help · An application');
  await expect(page.locator('[data-summary]')).not.toContainText('past chats');
  await page.locator('[data-edit]').click();
  await page.locator('input[value="coding"]').check();
  await expect(page.locator('[data-everyday-scope]')).toBeHidden();
  await page.locator('[data-next]').click(); await page.locator('[data-next]').click();
  for (const id of ['web-research', 'documents', 'personal-memory']) {
    await expect(page.locator(`input[value="${id}"]`)).toBeDisabled();
    await expect(page.locator(`input[value="${id}"]`)).not.toBeChecked();
  }
});

test('new everyday guide and source entries are reachable with valid headings and search results', async ({ page }) => {
  await page.goto('/capabilities/everyday/');
  await expect(page.getByRole('heading', { level: 1, name: 'Get everyday help' })).toBeVisible();
  for (const id of ids) {
    const link = page.locator(`main h3 a[href="/systems/${id}/"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Discovery evidence', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Limitations and review status', exact: true })).toBeVisible();
    await noOverflow(page);
    await page.goto('/capabilities/everyday/');
  }
  const searchUrls = await page.evaluate(async () => {
    const pagefind = await import('/pagefind/pagefind.js');
    return Promise.all((await pagefind.search('Perplexity')).results.map(async (result) => (await result.data()).url));
  });
  expect(searchUrls.some((url) => new URL(url, page.url()).pathname === '/systems/perplexity-consumer-web/')).toBe(true);
});

test('the everyday path never saves or sends answers, even when interests change', async ({ page }) => {
  await page.goto('/choose/'); await expect(page.locator('[data-chooser]')).toBeVisible();
  await page.waitForLoadState('networkidle');
  const snapshot = () => page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), cookie: document.cookie, url: location.href }));
  const before = await snapshot(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.locator('input[value="everyday"]').check(); await page.locator('[data-next]').click();
  await page.locator('input[value="application"]').check(); await page.locator('[data-next]').click();
  await page.locator('input[value="personal-memory"]').check(); await page.locator('[data-next]').click();
  await page.locator('[data-clear-interests]').click(); await page.locator('[data-reset]').click();
  expect(await snapshot()).toEqual(before); expect(requests).toEqual([]);
});

for (const theme of ['light', 'dark']) test(`everyday ${theme} guide and shortlist fit the viewport`, async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await everyday(page);
  await noOverflow(page); await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(`everyday-interests-${theme}.png`), fullPage: true });
  await page.locator('input[value="documents"]').check(); await page.locator('[data-next]').click();
  expect(await visibleIds(page)).toEqual(ids);
  await page.locator('[data-result-id]:visible summary').first().click();
  await noOverflow(page); await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(`everyday-shortlist-${theme}.png`), fullPage: true });
  await page.goto('/capabilities/everyday/'); await noOverflow(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(`everyday-guide-${theme}.png`), fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  await everyday(page); await page.locator('[data-skip]').click();
  await page.locator('[data-result-id]:visible summary').first().click(); await noOverflow(page);
});
