import { test, expect } from '@playwright/test';
import { topics } from '../src/lib/guide-topics.mjs';

async function captureAtTop(page, testInfo, name) {
  // Full-page captures of a scrolled page can place fixed headers in mid-content.
  // Reset the viewport explicitly, without changing page content or application focus logic.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath(name), fullPage: true });
}
for (const theme of ['light', 'dark']) test(`UI cards and actions align independently of prose margins (${theme})`, async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.goto('/');
  const grid = page.locator('.ho-capability-grid');
  const margins = await grid.locator(':scope > a').evaluateAll((cards) => cards.map((el) => getComputedStyle(el).marginTop));
  expect(margins.every((margin) => margin === '0px')).toBe(true);
  const boxes = await grid.locator(':scope > a').evaluateAll((cards) => cards.slice(0, 2).map((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
  if (Math.abs(boxes[0].x - boxes[1].x) > 1) expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
  await page.locator('img[src="/images/hero-use-cases-selected.avif"]').evaluate((img) => img.decode());
  await captureAtTop(page, testInfo, `home-${theme}.png`);
  await page.goto('/choose/');
  await page.locator('input[value="coding"]').check(); await page.locator('[data-next]').click();
  await page.locator('input[value="developer"]').check(); await page.locator('[data-next]').click();
  const buttons = page.locator('.ho-chooser-actions button:visible');
  const actionMargins = await buttons.evaluateAll((controls) => controls.map((el) => [getComputedStyle(el).marginTop, getComputedStyle(el).marginBottom]));
  expect(actionMargins.every(([top, bottom]) => top === '0px' && bottom === '0px')).toBe(true);
  await captureAtTop(page, testInfo, `chooser-${theme}.png`);
  await page.locator('[data-skip]').click();
  await expect(page.locator('#chooser-results-heading')).toBeFocused();
  await captureAtTop(page, testInfo, `shortlist-${theme}.png`);
});

test('each capability guide offers working jump links only for sections it contains', async ({ page }, testInfo) => {
  for (const { id } of topics) {
    await page.goto(`/capabilities/${id}/`);
    const nav = page.getByRole('navigation', { name: 'In this guide', exact: true });
    await expect(nav).toBeVisible();
    const hrefs = await nav.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) await expect(page.locator(`main ${href}`)).toHaveCount(1);
    await nav.getByRole('link', { name: 'Trade-offs', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/capabilities/${id}/#tradeoffs$`));
    await expect(page.locator('#tradeoffs')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.goto('/capabilities/coordination/');
  await captureAtTop(page, testInfo, 'guide-navigation.png');
});
